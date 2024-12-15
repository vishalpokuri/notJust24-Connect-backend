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
router.get("/presignedurl", verifyToken, async (req, res) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "connectionsapp", // Replace with your S3 bucket name
      Key: `profiles/${req.userId}.jpg`,
      ContentType: "image/jpeg",
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 }); // Expires in 1 hour

    console.log("Presigned URL:", signedUrl);
    res.status(200).json({
      presignedURL: signedUrl,
    });
  } catch (e) {
    console.error("Error generating Presigned url: ", e);
    res.status(403).json({ message: "Unable to generate PresignedURL" });
  }
});

module.exports = router;
