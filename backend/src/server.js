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
const Profile = require("../models/profile"); // see file for more information about Profile
const Bubl = require("../models/bubl"); // see file for more info
const Picture = require("../models/picture"); // see file for more info
const InviteToken = require("../models/invitetoken");
const http = require("http"); // for RTC socket live gallery
const { Server } = require("socket.io"); // for socket live gallery

const PORT = 3000;
const SECRET_KEY = "lucashancock"; // should be securely stored in the future!!!
// const REFRESH_SECRET_KEY = "lucashancock_refresh"; // for token refresh
// const TOKEN_EXPIRATION_TIME = "15m"; // for token expiration
const ENCRYPTION_KEY = "12345123451234512345123451234512"; // for the encryption. has to be 32 bytes exact. Also should be securely stored somewhere
const IV_LENGTH = 16; // always 16 for the encryption method I chose.
const hostname = "localhost";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const storage = multer.memoryStorage(); // Stuff for image upload... not too sure how this works. Maybe refactor later.
const upload = multer({ storage: storage }); // I think eventually gonna need to store photos in like an Amazon S3 server and then just serve the urls

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(bodyParser.json()); // Middleware to parse JSON bodies

io.on("connection", (socket) => {
  // console.log("A user connected");

  socket.on("joinRoom", (room) => {
    socket.join(room); // Join the room based on bubl_id
    // console.log(`User joined room ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room); // Leave the room based on bubl_id
    // console.log(`User left room ${room}`);
  });

  socket.on("photoUpdate", (photos) => {
    io.emit("photoUpdate", photos);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

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
    const profNewUser = await Profile.findOne({
      email: newEmail,
    });

    if (profNewUser && profNewUser.email !== userProfile.email) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // check for a valid email input
    if (!validator.isEmail(newEmail)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    // Validate and sanitize username
    const sanitizedUsername = validator.escape(newUsername);
    if (!/^[a-zA-Z0-9_.-]*$/.test(sanitizedUsername)) {
      return res.status(400).json({
        error:
          "Username can only contain letters, numbers, underscores, hyphens, and periods.",
      });
    }
    // Update the user profile information
    if (newUsername) userProfile.username = sanitizedUsername;
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
    const { username, password, email, token, bubl_id } = req.body;

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
      email: email,
    });
    console.log(token);
    console.log(bubl_id);
    if (token) {
      const inviteToken = await InviteToken.findOne({
        token: token,
      });
      if (inviteToken) {
        const bubl = await Bubl.findOne({ bubl_id: inviteToken.bubl_id });
        if (bubl) {
          bubl.members.push(user_id);
          await bubl.save();
        }
        await InviteToken.deleteOne({ token: token });
      }
    }
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

    // SEE PROFILE.JS FOR CASCADING DELETES.

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

    // CHECK bubl.js FOR CASCADING DELETE LOGIC

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
      capacity = 5,
      privacy,
      description,
      members = [],
      admins = [profile_id],
      start_date,
      end_date,
    } = req.body;
    // validate required fields.
    if (!name || !profile_id || !end_date || !privacy || !capacity) {
      return res.status(400).json({
        error: "Missing required fields",
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
      privacy,
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

    // check if already a member or admin.
    if (bubl.members.includes(profile_id) || bubl.admins.includes(profile_id)) {
      return res.status(400).json({ error: "You are already a member" });
    }
    // check if bubl at capacity.
    if (bubl.members.length + bubl.admins.length === bubl.capacity) {
      return res.status(400).json({ error: "Bubl is at capacity." });
    }

    const user = await Profile.findOne({ profile_id: profile_id });

    // check bubl privacy setting and change logic accordingly
    if (bubl.privacy === "private") {
      await new InviteToken({
        token: "",
        sender_id: profile_id,
        receiver_id: bubl.creator_id,
        email: user.email,
        bubl_id: bubl_id,
        type: "request",
      }).save();
      return res.status(200).json({ message: "requested" });
    } else {
      bubl.members.push(profile_id);
      await bubl.save();
      return res.status(200).json({ message: "joined" });
    }
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

    // filter out user from likes
    const pictures = await Picture.find({ bubl_id: bubl_id });
    for (const picture of pictures) {
      await picture.updateOne({ $pull: { likes: profile_id } });
    }

    await bubl.save();
    io.to(bubl_id).emit("photoUpdate");
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

    // make sure this is the owner of the photo, or an admin.
    const pic = await Picture.findOne({ picture_id: picture_id });
    const bubl = await Bubl.findOne({ bubl_id: pic.bubl_id });
    if (pic.creator_id !== profile_id && !bubl.admins.includes(profile_id)) {
      return res
        .status(400)
        .json({ error: "You cant delete this photo, you are not the owner." });
    }

    // delete the photo.
    await Picture.deleteOne({ picture_id: picture_id });
    io.to(pic.bubl_id).emit("photoUpdate");
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
  upload.array("photos", 3),
  async (req, res) => {
    try {
      // Extract data from the request body and files
      const { photoname, photodesc, bubl_id, photo_group } = req.body;
      const { profile_id } = req.profile_id;

      // Find the bubl and user
      const bubl = await Bubl.findOne({ bubl_id: bubl_id });
      if (!bubl) return res.status(404).json({ error: "Bubl doesn't exist." });
      // console.log("here");

      const user = await Profile.findOne({ profile_id: profile_id });
      if (!user) return res.status(404).json({ error: "User doesn't exist." });

      if (!req.files || req.files.length === 0)
        return res.status(400).send("No files uploaded.");

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

      // Add photos and update storage
      for (const file of req.files) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return res
            .status(400)
            .json({ error: "Uploaded file is not a valid photo." });
        }

        const picture_id = "picture_" + crypto.randomUUID();
        const base64Photo = file.buffer.toString("base64");
        const encryptedPhoto = encrypt(base64Photo);

        const data = {
          bytes: encryptedPhoto,
          mimeType: file.mimetype,
          filename: file.originalname,
        };

        const newPhoto = new Picture({
          picture_id,
          photoname,
          description: photodesc,
          creator_id: profile_id,
          likes: [],
          bubl_id,
          num_bytes: file.size,
          photo_group: photo_group,
          data: data,
        });
        await newPhoto.save();
      }

      // Update bubl storage
      await bubl.save();
      io.to(bubl_id).emit("photoUpdate");
      return res.status(200).json({ message: "Photos uploaded successfully!" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ error: "Error uploading photos." });
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

    const role = bubl.admins.includes(profile_id) ? "admin" : "member";

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
          profile_id: profile_id,
          data: {
            ...picture.data,
            bytes: decryptedBytes,
          },
        };
      })
    );

    const likedPhotos = returnArr
      .filter((picture) => picture.likes.includes(profile_id))
      .map((picture) => picture.picture_id);
    // console.log(likedPhotos);
    return res.status(200).json({
      displayName: bubl.name,
      returnArr: returnArr,
      likedPhotos: likedPhotos,
      profile_id: profile_id,
      role: role,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve bubl photos." });
  }
});

// Endpoint to edit an image
app.post("/edit/:id", verifyToken, async (req, res) => {
  try {
    const photoId = req.params.id;
    const { profile_id } = req.profile_id;
    const { newName, newDesc } = req.body;

    const photo = await Picture.findOne({ picture_id: photoId });
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    if (photo.creator_id !== profile_id) {
      return res.status(400).json({
        error: "You cannot edit, you are not the uploader of this photo.",
      });
    }
    photo.photoname = newName;
    photo.description = newDesc;
    await photo.save();
    io.to(photo.bubl_id).emit("photoUpdate");
    return res.status(200).json({ message: "Photo edited successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Fatal error editing photo." });
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
    io.to(photo.bubl_id).emit("photoUpdate");
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
  io.to(photo.bubl_id).emit("photoUpdate");
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
    const sender = await Profile.findOne({ profile_id: profile_id });
    const receiver = await Profile.findOne({ email: email });
    const toThisBubl = await Bubl.findOne({ bubl_id: bubl_id });

    // check if the bubl is at capacity or not
    if (
      toThisBubl.members.length + toThisBubl.admins.length ===
      toThisBubl.capacity
    ) {
      return res.status(400).json({ error: "Bubl is at capacity." });
    }
    let link = "";
    if (!receiver) {
      // check that invite has already been sent to this email
      const invite = await InviteToken.findOne({ email: email });
      if (invite)
        return res
          .status(400)
          .json({ error: "This email has already been invited." });

      // send the email for the receiver to register heer
      const token = crypto.randomBytes(32).toString("hex");
      link = `http://localhost:3001/register?token=${token}&bubl_id=${bubl_id}`;
      console.log(`sending mail to ${email}`);

      await new InviteToken({
        token,
        sender_id: sender.profile_id,
        // receiver_id: receiver.profile_id,
        email,
        bubl_id,
        type: "invite",
      }).save();
    } else {
      // the receiver exists
      if (receiver.email === sender.email) {
        return res
          .status(400)
          .json({ error: "You cannot send an invite to yourself." });
      }
      // check they arent apart of the bubl already
      if (
        toThisBubl.members.includes(receiver.profile_id) ||
        toThisBubl.admins.includes(receiver.profile_id)
      ) {
        return res
          .status(400)
          .json({ error: "receiver is already in that bubl." });
      }
      // Check if the receiver has already been invited to the same bubl
      const isInvited = await InviteToken.exists({
        $and: [{ receiver_id: receiver.profile_id }, { bubl_id: bubl_id }],
      });
      // console.log(isInvited);
      if (isInvited) {
        return res
          .status(400)
          .json({ error: "receiver has already been invited to this bubl" });
      }
      await new InviteToken({
        token: "",
        sender_id: sender.profile_id,
        receiver_id: receiver.profile_id,
        email: receiver.email,
        bubl_id: bubl_id,
        type: "invite",
      }).save();
      link = `http://localhost:3001/login`;
    }

    // await sendMail(
    //   email,
    //   "Invitation to join a bubl was sent to your account.",
    //   `You have been invited to join a bubl. Please login by clicking <a href="${loginLink}">here</a>.`
    // );
    // console.log("HERE");
    console.log(link);

    return res.status(200).json({
      message: "Invite sent successfully to email",
      link: link,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send invite" });
  }
});

app.get("/usersinvites", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const user = await Profile.findOne({ profile_id: profile_id });
  if (!user) return res.status(404).json("User not found");
  const invites = await InviteToken.find({
    $and: [{ receiver_id: profile_id }, { type: "invite" }],
  });
  const returnArr = await Promise.all(
    invites.map(async (invite) => {
      const sender = await Profile.findOne({ profile_id: invite.sender_id });
      const bubl = await Bubl.findOne({
        bubl_id: invite.bubl_id,
      });
      return {
        sender_username: sender.username,
        bubl_name: bubl.name,
        bubl_id: invite.bubl_id,
      };
    })
  );
  // console.log(returnArr);
  return res.status(200).json(returnArr || []);
});

app.post("/bublrequests", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const requests = await InviteToken.find({
    receiver_id: profile_id,
    type: "request",
  });

  const returnArr = await Promise.all(
    requests.map(async (request) => {
      const sender = await Profile.findOne({ profile_id: request.sender_id });
      const bubl = await Bubl.findOne({ bubl_id: request.bubl_id });
      return {
        sender: sender.email,
        bubl: bubl.name,
        bubl_id: bubl.bubl_id,
      };
    })
  );
  return res.status(200).json(returnArr || []);
});

app.post("/acceptrequest", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const { bubl_id, email } = req.body;

  const bubl = await Bubl.findOne({ bubl_id: bubl_id });
  const requestor = await Profile.findOne({ email: email });
  const acceptor = await Profile.findOne({ profile_id: profile_id });

  if (
    !bubl.admins.includes(acceptor.profile_id) ||
    bubl.members.includes(requestor.profile_id) ||
    bubl.admins.includes(requestor.profile_id) ||
    bubl.members.length + bubl.admins.length === bubl.capacity
  ) {
    return res.status(400).json({ error: "Error accepting request" });
  }
  bubl.members.push(requestor.profile_id);
  bubl.save();

  await InviteToken.deleteOne({
    type: "request",
    bubl_id: bubl_id,
    sender_id: requestor.profile_id,
  });

  return res.status(200).json({ message: "Successfully accepted request" });
});

app.post("/rejectrequest", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const { bubl_id, email } = req.body;

  const bubl = await Bubl.findOne({ bubl_id: bubl_id });
  const requestor = await Profile.findOne({ email: email });
  const acceptor = await Profile.findOne({ profile_id: profile_id });

  if (!bubl.admins.includes(acceptor.profile_id)) {
    return res
      .status(400)
      .json({ error: "You are not an admin you cannot reject this request." });
  }
  await InviteToken.deleteOne({
    type: "request",
    bubl_id: bubl_id,
    sender_id: requestor.profile_id,
  });
  return res.status(200).json({ message: "Successfully rejected request." });
});

app.post("/acceptinvite", verifyToken, async (req, res) => {
  try {
    const { profile_id } = req.profile_id;
    const { bubl_id } = req.body;
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    console.log(bubl_id);
    console.log(profile_id);
    // If bubl doesn't exist, return error, still remove invite
    // Also check if they are already in bubl
    if (
      !bubl ||
      bubl.members.includes(profile_id) ||
      bubl.admins.includes(profile_id)
    ) {
      console.log("here");
      await InviteToken.deleteOne({
        $and: [{ receiver_id: profile_id }, { bubl_id: bubl_id }],
      }).save();

      return res.status(404).json({ error: "Bubl not found." });
    }

    // Add the user to the members list of the bubl
    bubl.members.push(profile_id);
    await bubl.save();

    // Get rid of the invite from their profile.
    const user = await Profile.findOne({ profile_id: profile_id });
    await user.save();
    // delete the invite from the invites collection
    await InviteToken.deleteOne(
      { receiver_id: profile_id },
      { bubl_id: bubl_id }
    );
    res.status(200).json({ message: "Invite accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept invite." });
  }
});

app.post("/rejectinvite", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const { bubl_id } = req.body;

  await InviteToken.deleteOne(
    { receiver_id: profile_id },
    { bubl_id: bubl_id }
  );

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

    return res
      .status(200)
      .json({
        displayName: username,
        bubls_profile: bublsWithRole,
        owned_bubls: bublsWithRole.filter((bubl) => bubl.role === "creator"),
      });
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

app.post("/bublinfo", verifyToken, async (req, res) => {
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
      privacy: bubl.privacy,
      capacity: bubl.capacity,
      start_date: bubl.start_date,
      end_date: bubl.end_date,
    });
  } catch (error) {
    console.error("Error fetching Bubl info:", error);
    return res.status(500).json({ error: "Fatal error fetching Bubl info." });
  }
});

app.post("/bubledit", verifyToken, async (req, res) => {
  try {
    const { bubl_id, name, description, privacy } = req.body; // Assuming bubl_id is sent as a query parameter
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
    // check user is a the creator
    if (profile_id !== bubl.creator_id) {
      console.log("Here");
      return res.status(400).json({
        error: "You are not the creator, you cannot edit.",
      });
    }

    if (name) bubl.name = name;
    if (description) bubl.description = description;
    if (privacy) bubl.privacy = privacy;

    await bubl.save();

    // Return information about the Bubl
    return res.status(200).json({
      message: "Bubl edit successful",
    });
  } catch (error) {
    console.error("Error fetching Bubl info:", error);
    return res.status(500).json({ error: "Fatal error fetching Bubl info." });
  }
});

// End point to add a new photo group
app.post("/addphotogroup", verifyToken, async (req, res) => {
  try {
    const { group_name, bubl_id } = req.body;
    const { profile_id } = req.profile_id;

    // check if the bubl exists
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) {
      return res.status(404).json({ error: "Bubl not found" });
    }
    // check that the user exists
    const user = await Profile.findOne({ profile_id: profile_id });
    if (!user) {
      return res.status(404).json({ error: "Profile not found" });
    }
    // check if a group with that name already exists in the bubl.
    if (bubl.photo_groups.includes(group_name)) {
      return res.status(400).json({
        error:
          "That group name already exists in the bubl. Please choose a different name",
      });
    }
    // otherwise, add the group_name to the photo_groups array.
    bubl.photo_groups.push(group_name);
    await bubl.save();

    io.to(bubl_id).emit("photoUpdate");
  } catch (error) {
    console.log(error);
  }
});

app.post("/getbublphotogroups", verifyToken, async (req, res) => {
  const { profile_id } = req.profile_id;
  const { bubl_id } = req.body;

  // Check bubl and user exist.
  const bubl = await Bubl.findOne({ bubl_id: bubl_id });
  const user = await Profile.findOne({ profile_id: profile_id });
  if (!bubl || !user) {
    return res
      .status(404)
      .json({ error: "Could not find bubl or user. Try again." });
  }

  // Check that the user is a part of the bubl.
  if (!bubl.members.includes(profile_id) && !bubl.admins.includes(profile_id)) {
    return res.status(400).json({
      error:
        "You are not a part of this bubl. You cannot get the photo groups.",
    });
  }
  let returnArr = [];
  const promises = bubl.photo_groups.map(async (photo_group) => {
    const numPhotos = await Picture.find({ photo_group: photo_group });
    return {
      photo_group: photo_group,
      numPhotos: numPhotos.length,
      numLikes: numPhotos
        .map((photo) => photo.likes.length)
        .reduce((acc, cur) => acc + cur, 0),
    };
  });
  await Promise.all(promises)
    .then((results) => {
      returnArr = results;
      // console.log(returnArr);
    })
    .catch((error) => {
      console.error("Error fetching numPhotos.", error);
    });

  // otherwise, they are in the bubl, return the photo groups.
  return res.status(200).json({ returnArr: returnArr });
});
// End point to delete an existing photo group
app.post("/deletephotogroup", verifyToken, async (req, res) => {
  try {
    // Extract bubl_id and group_name from the request body
    const { bubl_id, group_name } = req.body;
    // console.log(bubl_id, "\n", group_name);
    // Find the Bubl document by bubl_id and profile_id and remove the group_name from photo_groups array
    const bubl = await Bubl.findOne({ bubl_id: bubl_id });
    if (!bubl) {
      return res.status(404).json({ error: "Bubl not found. " });
    }
    bubl.photo_groups = bubl.photo_groups.filter(
      (group) => group !== group_name
    );
    // delete all photos in this photo group and bookkeep their sizes in the bubl
    // await Picture.deleteMany({ photo_group: group_name });
    await Picture.deleteMany({ photo_group: group_name });
    await bubl.save();

    io.to(bubl_id).emit("photoUpdate");
    res.status(200).json({ message: "Photo group deleted successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error deleting photo group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// End point for editing a photo group
app.post("editphotogroup", verifyToken, async (req, res) => {
  // TO-DO
});

// Start the server after resetting the database
resetDatabase().then(() => {
  try {
    connectDB(); // connect to
    server.listen(PORT, hostname, () => {
      console.log(`Server is running on http://${hostname}:${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting or listening on port.");
    return;
  }
});
