const express = require("express");
const {
  uploadPhoto,
  downloadPhoto,
} = require("../controllers/photoController");

const {
  uploadPhotoMiddleware,
} = require("../middleware/photoUploadMiddleware");
const router = express.Router();

// Route for uploading profile photo
router.post("/upload", uploadPhotoMiddleware, uploadPhoto);

// Route for downloading a profile photo by fileId
router.get("/photo/:fileId", downloadPhoto);

module.exports = router;
