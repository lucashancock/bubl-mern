const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema(
  {
    picture_id: {
      type: String,
      required: true,
    },
    photoname: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    tags: [{ type: String, required: false }],
    creator_id: {
      type: String,
      required: true,
      ref: "Profile",
    },
    likes: [{ type: String, ref: "Profile" }],
    bubl_id: {
      type: String,
      required: true,
      ref: "Bubl",
    },
    data: {
      bytes: { type: String },
      mimeType: { type: String },
      filename: { type: String },
    },
  },
  { collection: "pictures" }
);

const Picture = mongoose.model("Picture", pictureSchema);

module.exports = Picture;
