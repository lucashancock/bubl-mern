const mongoose = require("mongoose");
const Bubl = require("./bubl");

const pictureSchema = new mongoose.Schema(
  {
    picture_id: {
      type: String,
      required: true,
    },
    photoname: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    tags: [{ type: String, required: false }], // added here but not implemented anywhere else.
    creator_id: {
      type: String,
      required: true,
      ref: "Profile",
    },
    likes: [{ type: String, ref: "Profile" }],
    bubl_id: {
      type: String,
      required: true,
    },
    photo_group: {
      type: String,
      required: true,
    },
    data: {
      bytes: { type: String },
      mimeType: { type: String },
      filename: { type: String },
    },
    start_date: { type: Date, required: true, default: Date.now },
    end_date: { type: Date, required: false, expires: 0 },
  },
  { collection: "pictures" }
);

pictureSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const bubl = await Bubl.findOne({ bubl_id: this.bubl_id });
      if (bubl) {
        this.end_date = bubl.end_date;
      } else {
        throw new Error("Bubl not found");
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Picture = mongoose.model("Picture", pictureSchema);

module.exports = Picture;
