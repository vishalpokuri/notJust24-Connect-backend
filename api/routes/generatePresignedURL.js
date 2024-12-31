const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_S3_KEY,
    secretAccessKey: process.env.AWS_SECRETACCESS_S3_KEY,
  },
});

const deleteS3Object = async (bucketName, objectKey) => {
  try {
    const deleteParams = {
      Bucket: bucketName, // The name of your S3 bucket
      Key: objectKey, // The key of the object to delete
    };

    const command = new DeleteObjectCommand(deleteParams);
    const response = await client.send(command);
  } catch (err) {
    console.error("Error deleting object:", err);
  }
};

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/presignedurlProfile", verifyToken, async (req, res) => {
  const gibber = generateHexGibberish(20);
  try {
    const profilePhotoKey = `profiles/PFP${gibber}.${req.query.mimetype}`;
    const command = new PutObjectCommand({
      Bucket: "connectionsapp", // Replace with your S3 bucket name
      Key: `profiles/PFP${gibber}.${req.query.mimetype}`,
      ContentType: req.query.mimetype,
    });

    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    }); // Expires in 1 hour

    res.status(200).json({
      presignedUrl,
      key: profilePhotoKey,
    });
  } catch (e) {
    console.error("Error generating Presigned url: ", e);
    res
      .status(403)
      .json({ message: "Unable to generate PresignedURL for PFP" });
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
    res
      .status(403)
      .json({ message: "Unable to generate PresignedURL for Selfie" });
  }
});

router.post("/filekey", async (req, res) => {
  const { key, email, workplace, description } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { profilePhotoKey: key, onboardingLevel: 4, workplace, description },
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

router.post("/edit", async (req, res) => {
  const data = req.body;
  //2. Now the object is deleted, fetch with populate and update details
  try {
    const existingUser = await User.findOne({ email: data.email }).populate([
      { path: "socialMediaData" },
    ]);

    if (!existingUser) {
      return res.status(400).json({
        message: `User not found with the email: ${email} to edit`,
      });
    }
    //1. Step 1, if formData.key == true, then delete the item from aws.
    if (data.key) {
      try {
        deleteS3Object("connectionsapp", existingUser.profilePhotoKey);
      } catch (e) {
        console.log(e);
      }
    }
    //Update with new profilePhotoKey
    existingUser.profilePhotoKey = data.key;
    existingUser.name = data.name;
    existingUser.username = data.username;
    existingUser.workplace = data.workplace;
    existingUser.description = data.description;
    existingUser.socialMediaData.github = data.socialMediaData.github;
    existingUser.socialMediaData.linkedin = data.socialMediaData.linkedin;
    existingUser.socialMediaData.telegram = data.socialMediaData.telegram;
    existingUser.socialMediaData.x = data.socialMediaData.x;
    await existingUser.save();
    res.status(200).json({
      message: "User Edited and Updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: `An error occurred while saving the social media details: ${e}`,
    });
  }
});
