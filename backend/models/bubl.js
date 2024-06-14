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
    requests: [{ type: String, ref: "Profile" }],
    members: {
      type: [{ type: String, ref: "Profile" }],
      default: [],
    },
    admins: {
      type: [{ type: String, ref: "Profile" }],
      default: [],
    },
    capacity: {
      type: Number,
      default: 5,
    },
    start_date: { type: Date, default: Date.now(), required: true },
    end_date: { type: Date, required: true },
  },
  { collection: "bubls" }
);

const Bubl = mongoose.model("Bubl", bublSchema);

module.exports = Bubl;
