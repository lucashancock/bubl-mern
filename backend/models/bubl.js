const mongoose = require("mongoose");

const bublSchema = new mongoose.Schema(
  {
    bubl_id: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    privacy: { type: String, required: true },
    creator_id: {
      type: String,
      required: true,
      ref: "Profile",
    },
    members: {
      type: [{ type: String, ref: "Profile" }],
      default: [],
    },
    admins: {
      type: [{ type: String, ref: "Profile" }],
      default: [],
    },
    photo_groups: {
      type: [{ type: String }],
      default: [],
    },
    capacity: {
      type: Number,
      default: 5,
    },
    start_date: { type: Date, default: Date.now(), required: true },
    end_date: { type: Date, required: true, expires: 0 },
  },
  { collection: "bubls" }
);

// cascading delete when "deleteOne" is called on a bubl.
bublSchema.pre("deleteOne", async function (next) {
  try {
    const conditions = this.getFilter();
    console.log(conditions.bubl_id);

    const Photo = mongoose.model("Picture");
    const InviteToken = mongoose.model("InviteToken");
    // will delete all of the photos associated with the bubl
    await Photo.deleteMany({ bubl_id: conditions.bubl_id });
    console.log("here");
    // delete any invites/requests to this bubl
    await InviteToken.deleteMany({ bubl_id: conditions.bubl_id });

    next();
  } catch (error) {
    next(error);
  }
});

const Bubl = mongoose.model("Bubl", bublSchema);

module.exports = Bubl;
