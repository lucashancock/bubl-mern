const mongoose = require("mongoose");
const Photo = require("./picture");
const Bubl = require("./bubl");
const InviteToken = require("./invitetoken");

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
  },
  { collection: "profiles" }
);

// function that will run prior to "deleteOne" on profile collection.
// will remove all of the bubls the profile is the creator of and all of the pictures are the uploader of
profileSchema.pre("deleteOne", async function (next) {
  try {
    const conditions = this.getFilter();
    console.log(conditions.profile_id);

    // delete any photos they are the creator of.
    await Photo.deleteMany({ creator_id: conditions.profile_id });

    // delete any bubls they are the creator of.
    await Bubl.deleteMany({ creator_id: conditions.profile_id });

    // remove this profile from any other bubls members or admins arrays
    await Bubl.updateMany(
      {
        $or: [
          { admins: conditions.profile_id },
          { members: conditions.profile_id },
        ],
      },
      {
        $pull: {
          admins: conditions.profile_id,
          members: conditions.profile_id,
        },
      }
    );

    // Remove from likes array
    await Photo.updateMany(
      { likes: conditions.profile_id },
      { $pull: { likes: conditions.profile_id } }
    );

    // delete any pending invites.
    await InviteToken.deleteMany({ sender_id: conditions.profile_id });
    await InviteToken.deleteMany({ receiver_id: conditions.profile_id });

    next();
  } catch (error) {
    next(error);
  }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
