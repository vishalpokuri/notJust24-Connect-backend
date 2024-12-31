const express = require("express");
const {
  createUsername,
  addSocials,
  userData,
  limiteduserData,
} = require("../controllers/userDataController");
const router = express.Router();

router.post("/createUsername", createUsername);
router.post("/addSocials", addSocials);
router.get("/fetchData", userData);
router.get("/fetchLimitedData", limiteduserData);
module.exports = router;
