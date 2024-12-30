const User = require("../models/User");
const ConnectionSelfie = require("../models/connectionSelfie");
exports.fetchUserAfterScan = async (req, res) => {
  const userId = req.query.userId;

  try {
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.set("Cache-Control", "no-store");
    res.status(200).json({
      name: existingUser.name,
      profilePhotoKey: existingUser.profilePhotoKey,
    });
  } catch (error) {
    console.log("Error fetching User with QR:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
exports.uploadSelfieConnection = async (req, res) => {
  const { userId1, userId2, selfieKey } = req.body;
  const newSelfieConnection = new ConnectionSelfie({
    userId1,
    userId2,
    selfieKey,
  });

  await newSelfieConnection.save();
  return res.status(200).json({
    message: "Created new Connection successfully",
    connectionId: newSelfieConnection._id,
  });
};
