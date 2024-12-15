const mongoose = require("mongoose");

const userSelfieSchema = new mongoose.Schema({
  username_1: { type: String, required: true },
  username_2: { type: String, required: true },
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "photos.files",
    required: true,
  }, // Reference to the GridFS photo
});

const UserSelfie = mongoose.model("UserSelfie", userSelfieSchema);
module.exports = UserSelfie;
