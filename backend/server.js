// server.js

const express = require("express");
const bcrypt = require("bcrypt"); // for encryption of passwords
const jwt = require("jsonwebtoken"); // for authentication
const crypto = require("crypto"); // for encryption
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // for uploading of pictures. ** maybe change later **
const validator = require("validator"); // for validating user input
const connectDB = require("./db");
const resetDatabase = require("./resetDatabase");
const Profile = require("./models/profile"); // see file for more information about Profile
const Bubl = require("./models/bubl"); // see file for more info
const Picture = require("./models/picture"); // see file for more info
const { start } = require("repl");

const app = express();
const storage = multer.memoryStorage(); // Stuff for image upload... not too sure how this works. Maybe refactor later.
const upload = multer({ storage: storage }); // I think eventually gonna need to store photos in like an Amazon S3 server and then just serve the urls

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(express.json());

const PORT = 3000;
const SECRET_KEY = "lucashancock"; // should be securely stored in the future!!!
const ENCRYPTION_KEY = "12345123451234512345123451234512"; // for the encryption. has to be 32 bytes exact. Also should be securely stored somewhere
const IV_LENGTH = 16; // always 16 for the encryption method I chose.
const hostname = "localhost";

// once login, the frontend will store this token in either SessionStorage they can access restricted endpoints.
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "No token provided. Access denied." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to authenticate token. Access denied." });
    }
    // Save the decoded token for use in other routes
    req.profile_id = decoded;
    next();
  });
};

// GET request for user profile
// IN: username, token
// OUT: profile_id, username, password, email
app.get("/profile", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id; // get the profile_id from the token

  const userProfile = await Profile.findOne({ profile_id: profile_id });
  if (!userProfile) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    profile_id: profile_id,
    username: userProfile.username,
    password: userProfile.password, // May exclude the password for security reasons!
    email: userProfile.email,
  });
});

// PUT request for changing profile info
// IN: newUsername, newEmail, token
// OUT: status message, profile obj, and new token
app.put("/profile", verifyToken, async (req, res) => {
  try {
    const { profile_id } = req.profile_id; // get the username from the token
    const { newUsername, newEmail } = req.body;

    const userProfile = await Profile.findOne({ profile_id: profile_id });
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the new username already exists
    const profNewUser = await Profile.findOne({ username: newUsername });
    if (profNewUser && profNewUser.username !== userProfile.username) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // TO-DO Add other new username checks here.

    // Update the user profile information
    if (newUsername) userProfile.username = newUsername;
    if (newEmail) userProfile.email = newEmail;

    await userProfile.save();

    // Create a new token with the updated username
    const newToken = jwt.sign(
      { profile_id: userProfile.profile_id },
      SECRET_KEY
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: userProfile,
      token: newToken,
    });
  } catch (error) {
    return res.status(500).json({ error: "Fatal error changing profile." });
  }
});

// POST request for registering a new user
// OUT: json message error or success.
// IN: username, password, and optional email
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Please enter a valid username, password, and email." });
    }

    // Check if the username or email already exists
    const existingUser = await Profile.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Check email is a valid email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    // Validate and sanitize username and password
    const sanitizedUsername = validator.escape(username);
    if (!/^[a-zA-Z0-9_.-]*$/.test(sanitizedUsername)) {
      return res.status(400).json({
        error:
          "Username can only contain letters, numbers, underscores, hyphens, and periods.",
      });
    }
    const sanitizedPassword = validator.escape(password);
    if (!/^[a-zA-Z0-9!@#$%^&*]{8,}$/.test(sanitizedPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain only letters, numbers, and special characters !@#$%^&*.",
      });
    }
    // Encrypt their password and user_id
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = "user_" + crypto.randomUUID();
    // Add to database
    const newprof = new Profile({
      profile_id: user_id,
      username: username,
      password: hashedPassword,
      invites: [],
      email: email,
    });
    await newprof.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST request for logging in
// OUT: token or error message
// IN: username and password
app.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    // Sanitize input
    username = validator.escape(username).trim();
    password = validator.escape(password);

    // Validate input
    if (!validator.isAlphanumeric(username) && !validator.isEmail(username)) {
      return res
        .status(400)
        .json({ error: "Invalid username or email format" });
    }

    // COMMENTED OUT FOR TESTING PURPOSES, fixed database values have password 123
    // if (!/^[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password)) {
    //     return res.status(400).json({ error: 'Password must be at least 8 characters long and contain only letters, numbers, and special characters !@#$%^&*.' });
    // }

    const user = await Profile.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Create and send JWT token for authentication
    const token = jwt.sign({ profile_id: user.profile_id }, SECRET_KEY);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// POST request for deleting a profile
// OUT: json message of whether or not profile deleted successfully
// IN: profile_id and password
app.post("/profiledelete", verifyToken, async (req, res) => {
  try {
    const { profile_id } = req.profile_id;
    const { password } = req.body;
    const existingUser = await Profile.findOne({ profile_id: profile_id });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: `No user to delete under ${username}` });
    }
    // Verify the password they enter to match the hashed one.
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Password does not match" });
    }
    // Delete any bubls they are the creator of
    await Bubl.deleteMany({ creator_id: profile_id });
    // Delete their name from members and admin arrays
    await Bubl.updateMany(
      { $or: [{ admins: profile_id }, { members: profile_id }] },
      {
        $pull: {
          admins: profile_id,
          members: profile_id,
        },
      }
    );
    // Change the name of creator_id to "deleted"
    await Picture.updateMany(
      { creator_id: profile_id },
      { $set: { creator_id: "deleted" } }
    );
    // Remove from likes array
    await Picture.updateMany(
      { likes: profile_id },
      { $pull: { likes: profile_id } }
    );
    // Remove the user from the profiles array
    await Profile.deleteOne({ profile_id: profile_id });
    res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Profile deletion failed" });
  }
});

// POST request for deleting a bubl
// OUT: success or error json message
// IN: bubl_id, user_id, token
app.post("/bubldelete", verifyToken, async (req, res) => {
  try {
    const { bubl_id } = req.body;
    const { profile_id } = req.profile_id;
    // find bubl from bubl_id
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) {
      return res.status(404).json({ error: `No bubl to delete` });
    }
    // check for existing user
    const existingUser = await Profile.findOne({ profile_id: profile_id });
    if (!existingUser) {
      return res.status(404).json({ error: `No user under ${username}` });
    }
    // check user's id is the same as bubl's creator.
    if (existingUser.profile_id !== bubl.creator_id) {
      return res.status(400).json({
        error: "You are not the owner of this bubl, you cannot delete it.",
      });
    }
    // delete all photos corresponding to this bubl_id
    await Picture.deleteMany({ bubl_id: bubl_id });
    // otherwise, they are the owner. delete the bubl.
    await Bubl.deleteOne({ bubl_id: bubl_id });
    res.status(201).json({ message: "Bubl deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Bubl deletion failed" });
  }
});

// POST request for new bubl creation
// OUT: success or error json message
// IN: name of bubl, creator's id, optional members list, optional admins list, start date, and end date.
app.post("/bublcreate", verifyToken, async (req, res) => {
  try {
    // creation of a bubl goes here.
    const { profile_id } = req.profile_id;
    const {
      name,
      members = [],
      admins = [profile_id],
      description,
      start_date,
      end_date,
      capacity = 2,
    } = req.body;
    // validate required fields.
    if (!name || !profile_id || !end_date) {
      return res.status(400).json({
        error:
          "Missing required fields. Please send atleast name of bubble, and the end date.",
      });
    }
    // check that the cretor id exists in profiles.
    const creatorExists = await Profile.findOne({ profile_id: profile_id });
    if (!creatorExists) {
      return res
        .status(404)
        .json({ error: "User does not exist in database." });
    }
    // Create new bubl's id by concatening with UUID
    const new_bub_id = name + "_" + crypto.randomUUID();

    const newBubl = new Bubl({
      bubl_id: new_bub_id,
      name,
      creator_id: profile_id,
      description,
      members,
      admins,
      capacity,
      start_date: start_date,
      end_date: end_date,
    });
    // Add to database of bubls
    await newBubl.save();
    res
      .status(201)
      .json({ message: "Bubl created successfully", bubl: newBubl });
  } catch (error) {
    res.status(500).json({ error: "Bubl creation failed" });
  }
});

// POST request for joining a bubl.
// OUT: success or error json message
// IN: bubl_id, user_id
// SN: Current functionality is that they automatically get added to members. In the future add an endpoint to promote and demote members to and from the admins list
app.post("/bubljoin", verifyToken, async (req, res) => {
  try {
    const { bubl_id } = req.body;
    const { profile_id } = req.profile_id;
    if (!bubl_id || !profile_id) {
      return res
        .status(400)
        .json({ error: "Please supply the bubl_id you would like to join." });
    }
    // get bubl from bubls array
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) {
      return res.status(404).json({ error: "Bubl not found!" });
    }

    // check if already a member.
    if (bubl.members.includes(profile_id)) {
      return res.status(400).json({ error: "You are already a member" });
    }
    // check if bubl at capacity.
    if (bubl.members.length + bubl.admins.length === bubl.capacity) {
      return res.status(400).json({ error: "Bubl is at capacity." });
    }

    bubl.members.push(profile_id);
    await bubl.save();
    res.status(200).json("Successfully joined bubl");
  } catch (error) {
    res.status(500).json({ error: "Bubl join failed" });
  }
});

// POST request for leaving a bubl
// IN: bubl_id, profile_id from token
// OUT: success or error message, database changed accordingly.
app.post("/bublleave", verifyToken, async (req, res) => {
  try {
    const { bubl_id } = req.body;
    const { profile_id } = req.profile_id;

    if (!bubl_id || !profile_id) {
      return res
        .status(400)
        .json({ error: "Please supply the bubl_id you would like to leave." });
    }

    // get bubl from bubls array
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) {
      return res.status(404).json({ error: "Bubl not found!" });
    }

    if (bubl.creator_id === profile_id) {
      return res
        .status(400)
        .json({ error: "You are the creator, you cannot leave." });
    }

    // filter out user from both members and admins.
    bubl.members = bubl.members.filter((member) => member !== profile_id);
    bubl.admins = bubl.admins.filter((admin) => admin !== profile_id);
    await bubl.save();

    res.status(200).json("Successfully left bubl");
  } catch (error) {
    res.status(500).json({ error: "Bubl join failed" });
  }
});

// POST request for deleting a photo
// IN: TODO
// OUT: TODO
app.post("/photodelete", verifyToken, async (req, res) => {
  try {
    const { picture_id } = req.body;
    const { profile_id } = req.profile_id;

    // make sure this is the owner of the photo.
    const pic = await Picture.findOne({ picture_id: picture_id });
    if (pic.creator_id !== profile_id) {
      return res
        .status(400)
        .json({ error: "You cant delete this photo, you are not the owner." });
    }
    // otherwise delete the photo.
    await Picture.deleteOne({ picture_id: picture_id });
    res.status(200).json({ message: "Successfully deleted photo." });
  } catch (error) {
    res.status(500).json({ error: "Photo deletion failed." });
  }
});

// POST request for uploading a photo
// OUT: success or error msg, photo added to database.
// IN: photo name, profile_id of uploader, bubl_id for photo, and SVG data

//-------------------------------------------
// I kinda hate this code below.
// Planning on switching the way I store
// files in the database to make this easier.
//-------------------------------------------

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  try {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Error decrypting data:", error);
    return ""; // Return empty string or handle the error appropriately
  }
}

app.post(
  "/photoupload",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { photoname, photodesc, bubl_id } = req.body;
      const { profile_id } = req.profile_id;

      const bubl = await Bubl.findOne({ bubl_id: bubl_id });
      if (!bubl) return res.status(404).json({ error: "Bubl doesn't exist." });

      const user = await Profile.findOne({ profile_id: profile_id });
      if (!user) return res.status(404).json({ error: "User doesn't exist." });

      if (!req.file) return res.status(400).send("No file uploaded.");

      // Check if the uploaded file is a photo
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimeTypes.includes(req.file.mimetype))
        return res.status(400).send("Uploaded file is not a valid photo.");

      // Generate a unique ID for the photo
      const picture_id = "picture_" + crypto.randomUUID();
      const base64Photo = req.file.buffer.toString("base64");
      const encryptedPhoto = encrypt(base64Photo);
      // Create a photo object
      const data = {
        bytes: encryptedPhoto,
        mimeType: req.file.mimetype,
        filename: req.file.originalname,
      };
      const newPhoto = new Picture({
        picture_id,
        photoname,
        description: photodesc,
        creator_id: profile_id,
        likes: [],
        bubl_id,
        data: data,
      });

      // Store the photo object in the array
      await newPhoto.save();
      return res.status(200).json({ message: "Photo uploaded successfully!" });
    } catch (error) {
      return res.status(500).json({ error: "Error uploading photo." });
    }
  }
);

// GET request for getting a bubl's photos
// OUT: the photos of the bubl
// IN: bubl_id, token
app.post("/bublphotos", verifyToken, async (req, res) => {
  try {
    const { bubl_id } = req.body;
    const { profile_id } = req.profile_id;
    if (!bubl_id || !profile_id) {
      return res.status(404).json("Error");
    }

    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) {
      return res.status(404).json("Error");
    }
    const profile = await Profile.findOne({ profile_id: profile_id });
    if (!profile) {
      return res.status(404).json("Error");
    }

    const inMembers = bubl.members.includes(profile_id);
    const inAdmins = bubl.admins.includes(profile_id);
    if (!inMembers && !inAdmins) {
      return res.status(400).json("Error");
    }

    const pictures = await Picture.find({ bubl_id: bubl_id });
    const returnArr = await Promise.all(
      pictures.map(async (picture) => {
        const creatorUser = await Profile.findOne({
          profile_id: picture.creator_id,
        });

        const decryptedBytes = decrypt(picture.data.bytes);
        return {
          ...picture.toObject(),
          creator_username: creatorUser
            ? creatorUser.username
            : "deleted account",
          data: {
            ...picture.data,
            bytes: decryptedBytes,
          },
        };
      })
    );

    return res
      .status(200)
      .json({ displayName: bubl.name, returnArr: returnArr });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve bubl photos." });
  }
});

// Endpoint to like an image
app.post("/like/:id", verifyToken, async (req, res) => {
  try {
    const photoId = req.params.id;
    const { profile_id } = req.profile_id; // Assuming profile_id is used to identify users
    const photo = await Picture.findOne({ picture_id: photoId });
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Check if the user has already liked the photo
    if (photo.likes.includes(profile_id)) {
      return res
        .status(400)
        .json({ error: "You have already liked this photo" });
    }
    // Add the user's id to the likes array
    photo.likes.push(profile_id);
    await photo.save();
    return res
      .status(200)
      .json({ message: "Photo liked successfully", likes: photo.likes.length });
  } catch (error) {
    return res.status(500).json({ error: "Fatal error liking photo. " });
  }
});

// Endpoint to unlike an image
app.post("/unlike/:id", verifyToken, async (req, res) => {
  const photoId = req.params.id;
  const { profile_id } = req.profile_id; // Assuming profile_id is used to identify users
  const photo = await Picture.findOne({ picture_id: photoId });
  if (!photo) {
    return res.status(404).json({ error: "Photo not found" });
  }

  // Check if the user has liked the photo
  const index = photo.likes.indexOf(profile_id);
  if (index === -1) {
    return res.status(400).json({ error: "You have not liked this photo" });
  }
  // Remove the user's id from the likes array
  photo.likes.splice(index, 1);
  await photo.save();
  return res
    .status(200)
    .json({ message: "Photo unliked successfully", likes: photo.likes.length });
});

app.get("/likedphotos", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id; // Assuming profile_id is used to identify users
  const likedPhotos = await Picture.find({ likes: profile_id });

  // Extract picture ids of liked photos
  const likedPhotoIds = likedPhotos.map((photo) => photo.picture_id);
  return res.status(200).json({ likedp: likedPhotoIds });
});

app.post("/invite", verifyToken, async (req, res) => {
  try {
    const { email, bubl_id } = req.body;
    const { profile_id } = req.profile_id;

    if (!profile_id) {
      return res
        .status(400)
        .json({ error: "No sender profile id, please log in." });
    }
    if (!email)
      return res.status(400).json({ error: "Receiver email is required" });

    // Validate email format using validator
    if (!validator.isEmail(email))
      return res.status(400).json({ error: "Invalid email format" });

    // Check if the email exists in the profiles collection
    const user = await Profile.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User email not found or that is you!" });
    }

    const toThisBubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (
      toThisBubl.members.includes(user.profile_id) ||
      toThisBubl.admins.includes(user.profile_id)
    ) {
      return res.status(400).json({ error: "User is already in that bubl." });
    }

    if (
      toThisBubl.members.length + toThisBubl.admins.length ===
      toThisBubl.capacity
    ) {
      return res.status(400).json({ error: "Bubl is at capacity." });
    }

    // Check if the user has already been invited to the same bubl
    const isInvited = user.invites.some(
      (invite) => invite.profile_id === profile_id && invite.bubl_id === bubl_id
    );
    if (isInvited) {
      return res
        .status(400)
        .json({ error: "User has already been invited to this bubl" });
    }

    const invitor = await Profile.findOne({ profile_id: profile_id });
    user.invites.push({
      profile_id: profile_id,
      invitor_username: invitor.username,
      bubl_id: bubl_id,
      bubl_name: bubl_id.substring(0, bubl_id.indexOf("_")),
    });
    await user.save(); // Save the updated profile document
    return res
      .status(200)
      .json({ message: "Invite sent successfully", invites: user.invites });
  } catch (error) {
    res.status(500).json({ error: "Failed to send invite" });
  }
});

app.get("/usersinvites", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const user = await Profile.findOne({ profile_id: profile_id });
  if (!user) return res.status(404).json("User not found");
  return res.status(200).json(user.invites || []);
});

app.post("/acceptinvite", verifyToken, async (req, res) => {
  try {
    const { profile_id } = req.profile_id;
    const { bubl_id } = req.body;
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });

    // If bubl doesn't exist, return error, still remove invite
    if (!bubl) {
      const user = await Profile.findOne({ profile_id: profile_id });
      user.invites = user.invites.filter(
        (invite) => invite.bubl_id !== bubl_id
      );
      await user.save();
      return res.status(404).json({ error: "Bubl not found." });
    }

    // Check if the user is already a member of the bubl
    if (bubl.members.includes(profile_id) || bubl.admins.includes(profile_id)) {
      const user = await Profile.findOne({ profile_id: profile_id });
      user.invites = user.invites.filter(
        (invite) => invite.bubl_id !== bubl_id
      );
      await user.save();
      return res
        .status(400)
        .json({ error: "You are already a member of this bubl." });
    }

    // Add the user to the members list of the bubl
    bubl.members.push(profile_id);
    await bubl.save();
    // Get rid of the invite from their profile.
    const user = await Profile.findOne({ profile_id: profile_id });
    user.invites = user.invites.filter((invite) => invite.bubl_id !== bubl_id);
    await user.save();
    res.status(200).json({ message: "Invite accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept invite." });
  }
});

app.post("/rejectinvite", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const { bubl_id } = req.body;

  const user = await Profile.findOne({ profile_id: profile_id });
  if (user) {
    user.invites = user.invites.filter((invite) => invite.bubl_id !== bubl_id);
    user.save();
  } else {
    res.status(404).json({ error: "User not found." });
  }
  res.status(200).json({ message: "Invite rejected successfully" });
});

app.post("/getrole", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const { bubl_id } = req.body;

  const bubl = await Bubl.findOne({ bubl_id: bubl_id });
  if (bubl.creator_id === profile_id) {
    return res.status(200).json({ role: "creator" });
  } else if (bubl.admins.includes(profile_id)) {
    return res.status(200).json({ role: "admin" });
  } else if (bubl.members.includes(profile_id)) {
    return res.status(200).json({ role: "member" });
  }
  return res.status(400).json("Something went wrong");
});

// POST request for getting a user's bubls they are a part of.
// OUT: the users bubls
// IN: token
app.post("/mybubls", verifyToken, async (req, res) => {
  try {
    const { profile_id } = req.profile_id;
    const { username } = await Profile.findOne({ profile_id: profile_id });
    const bublsForProfile = await Bubl.find({
      $or: [
        { creator_id: profile_id },
        { admins: profile_id },
        { members: profile_id },
      ],
    });
    const now = new Date();
    const validBubls = bublsForProfile.filter((bubl) => {
      const end = new Date(bubl.end_date);
      return !isNaN(end.getTime()) && end > now;
    });

    // add role
    const bublsWithRole = bublsForProfile.map((bubl) => {
      if (bubl.creator_id === profile_id)
        return { ...bubl.toObject(), role: "creator" };
      if (bubl.admins.includes(profile_id))
        return { ...bubl.toObject(), role: "admin" };
      return { ...bubl.toObject(), role: "member" };
    });

    bublsWithRole.unshift({ bubl_id: "addorjoincard" });
    return res
      .status(200)
      .json({ displayName: username, bubls_profile: bublsWithRole });
  } catch (error) {}
});

app.post("/bublmembers", verifyToken, async (req, res) => {
  try {
    const { bubl_id } = req.body;
    const { profile_id } = req.profile_id;

    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) return res.status(404).json({ error: "Bubl not found." });
    if (
      !bubl.members.includes(profile_id) &&
      !bubl.admins.includes(profile_id)
    ) {
      return res.status(400).json({
        errr: "You are not a part of this bubl. You cannot view its members. ",
      });
    }

    const memberNames = await Profile.find({
      profile_id: { $in: bubl.members },
    }).select("username");
    const memberNamesArr = memberNames.map((member) => member.username);
    const adminNames = await Profile.find({
      profile_id: { $in: bubl.admins },
    }).select("username");
    const adminNamesArr = adminNames.map((admin) => admin.username);
    return res
      .status(200)
      .json({ members: memberNamesArr, admins: adminNamesArr });
  } catch (error) {
    return res.status(500).json({ error: "Fatal error fetchin members." });
  }
});

app.post("/bubledit", verifyToken, async (req, res) => {
  try {
    const { bubl_id } = req.body; // Assuming bubl_id is sent as a query parameter
    const { profile_id } = req.profile_id;

    if (!profile_id)
      return res.status(400).json({ error: "Please login again." });

    const user = await Profile.findOne({ profile_id: profile_id });

    if (!user) {
      return res.status(400).json({ error: "User not found. " });
    }

    // Check if bubl_id is provided
    if (!bubl_id) {
      return res.status(400).json({ error: "Bubl ID is required." });
    }

    // Find the Bubl by ID
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });

    // Check if the Bubl exists
    if (!bubl) {
      return res.status(404).json({ error: "Bubl not found." });
    }

    // check user is a member or admin.
    if (!bubl.members.includes(profile_id) && !bubl.admins.includes(profile_id))
      return res.status(400).json({
        error:
          "You are not a part of this bubl, you cannot get its information.",
      });

    // Return information about the Bubl
    return res.status(200).json({
      description: bubl.description,
      name: bubl.name,
      capacity: bubl.capacity,
      start_date: bubl.start_date,
      end_date: bubl.end_date,
    });
  } catch (error) {
    console.error("Error fetching Bubl info:", error);
    return res.status(500).json({ error: "Fatal error fetching Bubl info." });
  }
});

// // Endpoint for debugging. Returns profiles list as json.
// app.get("/getusers", verifyToken, (_, res) => {
//   res.json(Profile.find());
// });

// // Endpoint for debugging. Returns bubls list as json.
// app.get("/getbubls", verifyToken, (_, res) => {
//   res.json(Bubl.find());
// });

// // Endpoint for debugging.
// app.get("/getpics", verifyToken, (_, res) => {
//   res.json(Picture.find());
// });

// Start the server after resetting the database
resetDatabase().then(() => {
  try {
    connectDB(); // connect to
    app.listen(PORT, hostname, () => {
      console.log(`Server is running on http://${hostname}:${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting or listening on port.");
    return;
  }
});
