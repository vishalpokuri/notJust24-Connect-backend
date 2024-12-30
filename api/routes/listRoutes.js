const express = require("express");
const {
  createListandUpdateInUser,
  fetchListsbyUserId,
  uploadInList,
} = require("../controllers/listController");

const router = express.Router();

router.put("/createListandUpdateInUser", createListandUpdateInUser);
router.get("/fetchListsbyUserId", fetchListsbyUserId);
router.put("/uploadInList", uploadInList);

module.exports = router;
