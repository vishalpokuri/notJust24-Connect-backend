const express = require("express");
const {
  createNotes,
  fetchNotesbyUserandConnectionId,
} = require("../controllers/notesController");

const router = express.Router();

router.post("/createNotes", createNotes);
router.get("/fetchNotesbyUserandConnectionId", fetchNotesbyUserandConnectionId);

module.exports = router;
