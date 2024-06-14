// models/InviteToken.js
const mongoose = require("mongoose");

const InviteTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  bubl_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1d" }, // Token expires in 1 day
});

module.exports = mongoose.model("InviteToken", InviteTokenSchema);
