const Note = require("../models/notes");
exports.createNotes = async (req, res) => {
  try {
    const { userId, connectionId, notes } = req.body;
    const newNotes = new Note({
      userId,
      connectionId,
      notes,
    });

    await newNotes.save();
    return res.status(200).json({
      message: "Created Notes successfully",
    });
  } catch (e) {
    return res.status(500).json({ message: `Unable to create Notes: ${e}` });
  }
};

exports.fetchNotesbyUserandConnectionId = async (req, res) => {
  try {
    const userId = req.query.userId;
    const connectionId = req.query.connectionId;
    const fetchedNotes = await Note.findOne({ userId, connectionId });
    if (fetchedNotes) {
      return res.status(200).json({
        notes: fetchedNotes.notes,
      });
    }
    return res.status(400).json({
      message: "Unable to fetch notes",
    });
  } catch (e) {
    return res.status(500).json({ message: `Unable to fetch Notes: ${e}` });
  }
};
