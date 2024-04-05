const express = require('express'); // Importing Express framework for creating the server
const path = require('path'); // Importing Path module for working with file paths
const bodyParser = require('body-parser'); // Importing Body-parser middleware for parsing request bodies
const multer = require('multer'); // Importing Multer middleware for handling file uploads
const cors = require('cors'); // Importing CORS middleware for enabling Cross-Origin Resource Sharing

const Profile = require('../models/profile.js')

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalname = file.originalname;
        const extension = originalname.split('.').pop();
        cb(null, uniqueSuffix + '.' + extension); // Append the original extension to the unique filename
    }
});
const upload = multer({ storage: storage }); // Configuring Multer to store uploaded files in the 'uploads' directory

const profileRouter = express.Router(); // Creating an Express application

profileRouter.use(cors()); // Adding CORS middleware to the Express app to enable cross-origin requests
profileRouter.use(express.urlencoded({ extended: true })); // Parsing URL-encoded request bodies
profileRouter.use(express.json()); // Parsing JSON request bodies
profileRouter.use(express.static(path.join(__dirname, 'public'))); // Serving static files from the 'public' directory
profileRouter.use('/uploads', express.static('uploads'));
profileRouter.use(bodyParser.urlencoded({ extended: true })); // Using body-parser middleware to parse URL-encoded bodies

let profiles = []; // Initializing an array to store profile data retrieved from MongoDB

// Handling POST requests to update a profile
// Path to database is /Database Name/collection name/key variable in target object
// ID is used as MongoDB automatically generates a unique ID for each object in a collection
profileRouter.post("/profile/:_id", upload.single('newProfilePicture'), async function (req, res) {
    try {
        // Access Form fields
        console.log("Accessing Form fields");

        // Retrieve form data
        const newUsername = req.body.newUsername;
        console.log("new username " + newUsername);

        const newDescription = req.body.newDescription;
        console.log("new desc " + newDescription);

        let newProfilePicture = '';

        // Check if newProfilePicture file is uploaded
        if (req.file) {
            console.log("file exists");
            newProfilePicture = req.file.filename; // Assuming multer renames the file and stores it in the uploads directory
        }
        else {
            console.log("file does not exist");
        }

        let updatedProfile = {
            username: newUsername,
            pfp_link: newProfilePicture ? `/uploads/${newProfilePicture}` : '',
            desc: newDescription
        };

        console.log("Gathered data is: ");
        console.log("Username: " + updatedProfile.username + ", Profile picture link: " + updatedProfile.pfp_link + ", Description: " + updatedProfile.desc);

        // Update profile in MongoDB

        console.log("Updating profile within database");
        let updatedProfileDocument = await Profile.findByIdAndUpdate(req.params.id, updatedProfile, { new: true });

        console.log("Profile updated successfully:", updatedProfileDocument);
        res.status(200).send("Profile updated successfully");
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).send("Error updating profile");
    }
});

// Handling POST requests to create a new profile
profileRouter.post("/profile", async function (req, res) {
    try {
        // Retrieve form data
        const newUsername = req.body.username;
        const newPassword = req.body.password;
        const newEmail = req.body.email;

        // Default profile picture link
        const defaultProfilePicture = "Png.png";

        // Create a new profile object
        const newProfile = new profile({
            username: newUsername,
            password: newPassword,
            email: newEmail,
            pfp_link: defaultProfilePicture,
            desc: ""
        });

        // Save the new profile object to the database
        await newProfile.save();

        console.log("New profile created successfully");

        // Update the profiles array with the new profile
        profiles.push(newProfile.toObject());

        res.status(200).send(newProfile.toObject()); // Send the newly created profile as response
    } catch (err) {
        console.error("Error creating new profile:", err);
        res.status(500).send("Error creating new profile");
    }
});

profileRouter.get("/profile", async (req, res) => {
    try {
        console.log("Gathering profiles from database");
        profiles = await Profile.find({}); // Retrieving profiles from MongoDB
        res.send(profiles); // Sending retrieved profiles as response
        console.log("Profiles received");
        console.log("Number of profiles: " + profiles.length);
        for (let i = 0; i < profiles.length; i++) {
            console.log("_id: " + profiles[i]._id +
                ", Username: " + profiles[i].username +
                ", Description: " + profiles[i].desc +
                ", Profile picture link: " + profiles[i].pfp_link +
                ", Type: " + profiles[i].type +
                ", Email: " + profiles[i].email +
                ", Password: " + profiles[i].password +
                ", Remember LogIn: " + profiles[i].rememberLogIn);
        }
        console.log("Received profiles listed");
    } catch (err) {
        console.error("Error retrieving profiles:", err);
        res.status(500).send("Error retrieving profiles");
    }
});

// Handling GET requests to search profiles
profileRouter.get("/profile/search", async (req, res) => {
    try {
        const searchData = req.query.search;
        console.log("Searching for profiles with:", searchData);

        let foundProfiles;

        if (searchData) {
            // Perform a search query based on search parameters
            foundProfiles = await Profile.find({
                $or: [
                    { username: { $regex: searchData, $options: 'i' } }, // Case-insensitive search on username
                    { type: { $regex: searchData, $options: 'i' } } // Case-insensitive search on profile type
                ]
            });
        } else {
            // If no search parameters provided, return all profiles
            foundProfiles = await profile.find({});
        }

        console.log("Found profiles " + foundProfiles);

        res.json(foundProfiles);
    } catch (err) {
        console.error("Error searching profiles:", err);
        res.status(500).send("Error searching profiles");
    }
});

// Rendering profile.html
profileRouter.get('/profile/:_id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params._id);
        console.log("profile id is _id = " + req.params._id);
        console.log("profile id retrieved is _id = " + profile._id + " username is " + profile.username + " pfp_link is " + profile.pfp_link + " desc is " + profile.desc);
        // Pass profile properties directly to the template
        res.render('profile', {
            profile: {
                username: profile.username,
                pfp_link: profile.pfp_link,
                desc: profile.desc,
                _id: profile._id
            }
        });
    } catch (err) {
        console.error("Error rendering profile:", err);
        res.status(500).send("Error rendering profile");
    }
});


// Rendering edit.html
profileRouter.get('/edit/:_id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params._id);
        res.render('edit', {
            profile: {
                username: profile.username,
                pfp_link: profile.pfp_link,
                desc: profile.desc,
                _id: profile._id
            }
        });
    } catch (err) {
        console.error("Error rendering edit profile:", err);
        res.status(500).send("Error rendering edit profile");
    }
});

module.exports = profileRouter;