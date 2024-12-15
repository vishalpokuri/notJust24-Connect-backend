const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const profilePhotoSchema = new mongoose.Schema({
  filename: String,
  metadata: {
    userId: mongoose.Schema.Types.ObjectId, // Store the user reference if needed
    filename: String,
  },
});

const ProfilePhoto = mongoose.model("ProfilePhoto", profilePhotoSchema);

// Setting up GridFS bucket for photo storage
const setupPhotoStorage = async () => {
  const connection = mongoose.connection;
  const photoBucket = new GridFSBucket(connection.db, {
    bucketName: "profilephotos", // You can change this name as needed
  });
  return photoBucket;
};

module.exports = { ProfilePhoto, setupPhotoStorage };
