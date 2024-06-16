// models/InviteToken.js
// handles all of the inviting and requesting

const mongoose = require("mongoose");

const InviteTokenSchema = new mongoose.Schema({
  token: { type: String, unique: true }, // token for when inviting someone who is not registered yet. "" for people who are registered
  sender_id: { type: String, required: false }, // sender's profile id. not required.
  receiver_id: { type: String, required: false }, // receiver's profile id. not required.
  email: { type: String, required: false }, // email of reciever.
  bubl_id: { type: String, required: true }, // bubl id in question.
  type: { type: String, required: false },
  expireAt: { type: Date, default: Date.now, expires: 86400 }, // all invites/requests have an expiration of 1 day by default
});

module.exports = mongoose.model("InviteToken", InviteTokenSchema);
