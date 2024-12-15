const express = require("express");
const router = express.Router();
const {
  uploadUserSelfie,
  getUserSelfieByUsername1,
  getConnectionsByUsername,
  getSelfieByUsernames,
} = require("../controllers/userSelfieController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("photo"), uploadUserSelfie);
router.get("/:username_1", getUserSelfieByUsername1);
router.get("/connections/:username", getConnectionsByUsername);
router.get("/photo/:username_1/:username_2", getSelfieByUsernames);

module.exports = router;
