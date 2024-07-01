const fs = require("fs");
const connectDB = require("./db");
const Picture = require("../models/picture");
const Profile = require("../models/profile");
const Bubl = require("../models/bubl");
const InviteToken = require("../models/invitetoken");

const mongoose = require("mongoose");

async function resetDatabase() {
  try {
    // Connect to the database
    await connectDB();

    // Read JSON files
    const profilesData = JSON.parse(
      fs.readFileSync("./data/profiles.json", "utf8")
    );
    const bublsData = JSON.parse(fs.readFileSync("./data/bubls.json", "utf8"));
    const picturesData = JSON.parse(
      fs.readFileSync("./data/pictures.json", "utf8")
    );

    // Delete existing data
    await Profile.deleteMany({});
    await Bubl.deleteMany({});
    await Picture.deleteMany({});
    await InviteToken.deleteMany({});

    await Profile.insertMany(profilesData);
    await Bubl.insertMany(bublsData);
    // await Picture.insertMany(picturesData);

    console.log("Database reset successfully");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
}

module.exports = resetDatabase;
