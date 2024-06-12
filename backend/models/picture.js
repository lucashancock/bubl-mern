const mongoose = require("mongoose");

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
      ref: "Bubl",
    },
    data: {
      bytes: { type: String },
      mimeType: { type: String },
      filename: { type: String },
    },
    end_date: { type: Date },
  },
  { collection: "pictures" }
);

pictureSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const bubl = await this.model("Bubl").findOne({ bubl_id: this.bubl_id });
      console.log(bubl.name);
      if (!bubl) {
        throw new Error("Associated Bubl not found");
      }
      this.end_date = bubl.end_date;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Picture = mongoose.model("Picture", pictureSchema);

module.exports = Picture;
