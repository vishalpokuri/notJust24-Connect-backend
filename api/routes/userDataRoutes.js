const express = require("express");
const {
  createUsername,
  addSocials,
  userData,
} = require("../controllers/userDataController");
const router = express.Router();

router.post("/createUsername", createUsername);
router.post("/addSocials", addSocials);
router.get("/fetchData", userData);
module.exports = router;
