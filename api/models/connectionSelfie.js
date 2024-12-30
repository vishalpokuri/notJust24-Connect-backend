const mongoose = require("mongoose");

const ConnectionSelfieSchema = new mongoose.Schema({
  userId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  selfieKey: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const ConnectionSelfie = mongoose.model(
  "ConnectionSelfie",
  ConnectionSelfieSchema
);
module.exports = ConnectionSelfie;
