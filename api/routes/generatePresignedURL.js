const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_S3_KEY,
    secretAccessKey: process.env.AWS_SECRETACCESS_S3_KEY,
  },
});

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");
router.get("/presignedurlProfile", verifyToken, async (req, res) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "connectionsapp", // Replace with your S3 bucket name
      Key: `profiles/${req.userId}.${req.query.mimetype}`,
      ContentType: req.query.mimetype,
    });

    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    }); // Expires in 1 hour

    res.status(200).json({
      presignedUrl,
      key: `connectionsapp/profiles/${req.userId}.${req.query.mimetype}`,
    });
  } catch (e) {
    console.error("Error generating Presigned url: ", e);
    res.status(403).json({ message: "Unable to generate PresignedURL" });
  }
});

const generateHexGibberish = (length) => {
  let result = "";
  const characters = "0123456789abcdef";
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * 16)];
  }
  return result;
};

router.get("/presignedurlSelfie", verifyToken, async (req, res) => {
  const gibber = generateHexGibberish(20);
  try {
    const Selfiekey = `connectionSelfies/Selfie${gibber}.${req.query.mimetype}`;
    const command = new PutObjectCommand({
      Bucket: "connectionsapp", // Replace with your S3 bucket name
      Key: Selfiekey,
      ContentType: req.query.mimetype,
    });

    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    }); // Expires in 1 hour

    res.status(200).json({
      presignedUrl,
      key: Selfiekey,
    });
  } catch (e) {
    console.error("Error generating Presigned url: ", e);
    res.status(403).json({ message: "Unable to generate PresignedURL" });
  }
});

router.post("/filekey", async (req, res) => {
  const { key, email } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { profilePhotoKey: key, onboardingLevel: 4 },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile key updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.err("Error putting fileKey: ", err);
  }
});
module.exports = router;
