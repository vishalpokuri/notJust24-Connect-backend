const multer = require("multer");
const setupPhotoStorage = require("../models/photoModel");
const UserSelfie = require("../models/UserSelfie");

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadUserSelfie = async (req, res) => {
  const { username_1, username_2 } = req.body;
  const { originalname, buffer } = req.file;

  try {
    // Check if this combination (or reverse) already exists in the database
    const existingRecord = await UserSelfie.findOne({
      $or: [
        { username_1: username_1, username_2: username_2 },
        { username_1: username_2, username_2: username_1 }, // Check for reverse combination
      ],
    });

    if (existingRecord) {
      // If the combination exists, return an error message
      return res
        .status(400)
        .json({ message: "This combination of usernames already exists." });
    }

    // Proceed to save the photo and user info since it's a unique combination
    const photoBucket = await setupPhotoStorage();
    const uploadStream = photoBucket.openUploadStream(originalname);
    uploadStream.end(buffer);

    uploadStream.on("finish", async () => {
      const newUserSelfie = new UserSelfie({
        username_1,
        username_2,
        photoId: uploadStream.id,
      });

      const savedUserSelfie = await newUserSelfie.save();
      res.status(201).json({
        message: "User and Selfie saved successfully",
        data: savedUserSelfie,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload photo and save user",
      error: error.message,
    });
  }
};

exports.getUserSelfieByUsername1 = async (req, res) => {
  const { username_1 } = req.params;

  try {
    const userPhotoResult = await UserSelfie.findOne({ username_1 });
    if (!userPhotoResult)
      return res.status(404).json({ message: "User not found" });

    const photoBucket = await setupPhotoStorage();

    const downloadStream = photoBucket.openDownloadStream(
      userPhotoResult.photoId
    );

    downloadStream.on("error", (err) => {
      res.status(404).json({ message: "Photo not found", error: err.message });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user and photo",
      error: error.message,
    });
  }
};

exports.getConnectionsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Find all connections where username is either username_1 or username_2
    const connections = await UserSelfie.find({
      $or: [{ username_1: username }, { username_2: username }],
    });

    if (!connections || connections.length === 0) {
      return res
        .status(404)
        .json({ message: "No connections found for this username" });
    }

    res.status(200).json({ connections });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving connections", error: error.message });
  }
};

exports.getSelfieByUsernames = async (req, res) => {
  const { username_1, username_2 } = req.params;

  try {
    const userPhotoResult = await UserSelfie.findOne({
      $or: [
        { username_1: username_1, username_2: username_2 },
        { username_1: username_2, username_2: username_1 },
      ],
    });

    if (!userPhotoResult) {
      return res
        .status(404)
        .json({ message: "No record found for the given usernames." });
    }

    const photoBucket = await setupPhotoStorage();

    const downloadStream = photoBucket.openDownloadStream(
      userPhotoResult.photoId
    );

    downloadStream.on("error", (err) => {
      res.status(404).json({ message: "Photo not found", error: err.message });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving photo", error: error.message });
  }
};
