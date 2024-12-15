const express = require("express");
const {
  createUsername,
  addSocials,
} = require("../controllers/userDataController");
const router = express.Router();

router.post("/createUsername", createUsername);
router.post("/addSocials", addSocials);
module.exports = router;
