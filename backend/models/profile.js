const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    profile_id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    invites: [
      {
        profile_id: { type: String, ref: "Profile" },
        invitor_username: { type: String },
        bubl_id: { type: String, ref: "Bubl" },
        bubl_name: { type: String },
      },
    ],
  },
  { collection: "profiles" }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
