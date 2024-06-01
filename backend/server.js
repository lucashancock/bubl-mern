// server.js

const express = require('express');
const bcrypt = require('bcrypt'); // for encryption of passwords
const jwt = require('jsonwebtoken'); // for ...
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;
const SECRET_KEY = "lucashancock";
let cur_id = 0;
let bub_id = 0;
let photo_id = 0;
/*
```
profile:
    profile_id:
    username:
    password:
    email(optional):
```
*/
const profiles = [];
  
/*
```
bubls:
    bubl_id: id
    name: string
    creator_id: id
    members: [ ] list of ids of regular members
    admins: [ ] list of ids of admins of bubl
    start_date: date
    end_date: date (required end date when record will be wiped from storage)
```
*/
const bubls = [];

/*
```
pictures:
    picture_id: id
    name(optional): string
    creator_id: id
    likes: int
    bubl_id: id
    data: photo data goes here?
    end_date: date (to remove them when done using)
```
*/
const pictures = [];

// once login, the frontend will store this token in either LocalStorage, SessionStorage, or Cookies so that
// they can access restricted endpoints. 
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided. Access denied.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token. Access denied.' });
        }
        // Save the decoded token for use in other routes
        req.user = decoded;
        next();
    });
}

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/profile', verifyToken, (req, res) => {
    const { username } = req.user; // get the username from the token

    // Find the user profile by username
    const userProfile = profiles.find(profile => profile.username === username);
    if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Return the user profile information
    res.json({
        profile_id: userProfile.profile_id,
        username: userProfile.username,
        email: userProfile.email
        // You may exclude the password for security reasons
    });
});

app.put('/profile', verifyToken, (req, res) => {
    const { username } = req.user; // get the username from the token
    const { newUsername, newEmail } = req.body;

    // Find the user profile by username
    const userIndex = profiles.findIndex(profile => profile.username === username);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if the new username already exists
    if (newUsername && profiles.some(profile => profile.username === newUsername && profile.username !== username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Update the user profile information
    if (newUsername) profiles[userIndex].username = newUsername;
    if (newEmail) profiles[userIndex].email = newEmail;

    // Create a new token with the updated username
    const newToken = jwt.sign({ username: profiles[userIndex].username }, SECRET_KEY);

    res.json({ message: 'Profile updated successfully', profile: profiles[userIndex], token: newToken });
});


// Define a route for the register URL
app.post('/register', async (req,res) => {
    try {
        const { username, password, email = ''} = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Please enter a valid username and password.'})
        }

        // Check if the username already exists
        const existingUser = profiles.find(profile => profile.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        profiles.push({
            profile_id: ++cur_id,
            username: username,
            password: hashedPassword,
            email: email
        })

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Endpoint for deleting a profile
// User must be verified (logged in)
app.post("/profiledelete", verifyToken, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const existingUserIndex = profiles.findIndex(profile => profile.username === username);
        if (existingUserIndex === -1) {
            return res.status(400).json({ error: `No user to delete under ${username}` });
        }

        const existingUser = profiles[existingUserIndex];

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Password does not match' });
        }

        // Remove the user from the profiles array
        profiles.splice(existingUserIndex, 1);

        res.status(201).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Profile deletion failed' });
    }
});

// Endpoint for deleting a bubl
// user must be verified (logged in)
app.post("/bubldelete", verifyToken, async (req, res) => {
    try {
        // user requesting deletion of bubl has to be owner.
        // request body must have bubl_id and 
        const { bubl_id, username } = req.body;

        // find bubl from bubl_id
        const bubl_ind = bubls.findIndex(bubl => bubl.bubl_id === bubl_id);
        if (bubl_ind === -1) {
            return res.status(400).json({ error: `No bubl to delete` });
        }
        const bubl_to_delete = bubls[bubl_ind];

        const existingUserIndex = profiles.findIndex(profile => profile.username === username);
        if (existingUserIndex === -1) {
            return res.status(400).json({ error: `No user under ${username}` });
        }

        const user_ind = profiles.findIndex(profile => profile.username === username);
        const bubl_owner = profiles[user_ind];

        // check bubl_owner's id is the same as bubl's creator.
        if (bubl_owner.profile_id !== bubl_to_delete.creator_id) {
            return res.status(400).json({ error: 'You are not the owner of this bubl, you cannot delete it.' });
        }
        bubls.splice(user_ind, 1);

        res.status(201).json({ message: 'Bubl deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bubl deletion failed' });
    }
});

// Endpoint which creates a new bubl
app.post("/bublcreate", verifyToken, async (req, res) => {
    try {
        // creation of a bubl goes here.
        const { name, creator_id, members = [], admins = [creator_id], start_date, end_date } = req.body;

        // validate required fields.
        if (!name || !creator_id || !end_date) {
            return res.status(400).json({ error: "Missing required fields. Please send atleast name of bubble, creator's id, and the end date."});
        }

        // check that the cretor id exists in profiles.
        const creatorExists = profiles.some(profile => profile.profile_id === creator_id);
        if (!creatorExists) {
            return res.status(400).json({ error: "Invalid creator_id" });
        }

        const newBubl = {
            bubl_id: ++bub_id,
            name,
            creator_id,
            members,
            admins,
            start_date: new Date(start_date),
            end_date: new Date(end_date)
        }
        // Add to database of bubls
        bubls.push(newBubl);

        res.status(201).json({ message: "Bubl created successfully", bubl: newBubl });
    } catch (error) {
        res.status(500).json({ error: "Bubl creation failed"});
    }
})

// Endpoint for deleting a picture
// user must be verified (logged in)
app.post("/photodelete", verifyToken, async (req, res) => {
    try {
        // user requesting deletion of photo has to be owner.
        // request body must have photo_id and 

        // To-do
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bubl deletion failed' });
    }
});

app.post("/photoupload", verifyToken, async (req,res) => {
    try {
        const { photoname, profile_id, bubl_id, data } = req.body;
        
        // TO-DO: need to handle non-existing bubl_id
        // TO-DO: need to handle non_existing profile_id

        // Generate a unique ID for the photo
        const picture_id = ++photo_id;
        
        // Encrypt the encoded photo data
        const encryptionKey = crypto.randomBytes(32); // Generate a random encryption key
        const iv = crypto.randomBytes(16); // Generate a random initialization vector
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
        let encryptedData = cipher.update(data, 'base64', 'base64');
        encryptedData += cipher.final('base64');
        
        const newPhoto = {
            picture_id,
            photoname,
            creator_id: profile_id,
            likes: 0,
            bubl_id,
            data: {
                encryptedData,
                iv: iv.toString('base64'),
                encryptionKey: encryptionKey.toString('base64')
            }
        };
        
        pictures.push(newPhoto);
        res.status(201).json({ message: "Photo uploaded successfully", photo: newPhoto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Photo upload failed." });
    }
})

// Endpoint for debugging. Returns profiles list as json.
app.get('/getusers', verifyToken, (_,res) => {
    res.json(profiles);
})

// Endpoint for debugging. Returns bubls list as json. 
app.get('/getbubls', verifyToken, (_,res) => {
    res.json(bubls);
})

app.get('/getpics', verifyToken, (_, res) => {
    res.json(pictures);
})

// Endpoint for logging in
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // find user in database if they exist
        const user = profiles.find(profile => profile.username === username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' })
        }

        // Creat and send JWT token for authentication
        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Endpoint for sending a specific users bubls as json to the fronten
app.get('/mybubls', verifyToken, (req, res) => {
    const { profile_id, username } = req.body;
    const mybubls = getBublsForProfile(profile_id);
    res.json(mybubls);
});

function getBublsForProfile(profileId) {
    const bublsForProfile = [];

    bubls.forEach(bubl => {
        if (bubl.creator_id === profileId) {
            bublsForProfile.push({ ...bubl, role: 'creator' });
        } else if (bubl.admins.includes(profileId)) {
            bublsForProfile.push({ ...bubl, role: 'admin' });
        } else if (bubl.members.includes(profileId)) {
            bublsForProfile.push({ ...bubl, role: 'member' });
        }
    });

    return bublsForProfile;
}

app.get('/getbublpics', verifyToken, (req, res) => {
    const { bubl_id, profile_id } = req.body;

    // Find the bubl in the bubls array
    const bubl = bubls.find(bubl => bubl.bubl_id === bubl_id);
    if (!bubl) {
        return res.status(400).json({ error: "Bubl doesn't exist!"})
    }
    // Check if the profile is a member or admin of the bubl
    const isProfileInBubl = bubl.members.includes(profile_id) || bubl.admins.includes(profile_id);
    if (!isProfileInBubl) {
        return res.status(400).json({ error: "You are not a part of this bubl, you cannot view the photos." });
    }

    // Retrieve encrypted photo data for the bubl
    const pictures = getPicturesInBubl(bubl_id);

    // Decrypt the encrypted photo data
    const decryptedPictures = pictures.map(photo => {
        const encryptionKey = Buffer.from(photo.data.encryptionKey, 'base64');
        const iv = Buffer.from(photo.data.iv, 'base64');

        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);

        let decryptedData = decipher.update(photo.data.encryptedData, 'base64', 'binary');
        decryptedData += decipher.final('binary');

        return {
            ...photo,
            data: decryptedData
        };
    });

    // Send the decrypted photos to the client
    res.json(decryptedPictures);
});

function getPicturesInBubl(bubl_id) {
    const picturesInBubl = pictures.filter(picture => picture.bubl_id === bubl_id);
    return picturesInBubl;
}

// Define a route for the /about URL
app.get('/api/about', (req, res) => {
    res.send('This is the about page.');
});

// Define a route for the /data URL
app.post('/api/data', (req, res) => {
    const data = req.body;
    res.send(`You sent: ${JSON.stringify(data)}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
