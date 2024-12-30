const { mongoose } = require("mongoose");

const noteSchema = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Connection",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
