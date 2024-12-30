const { mongoose } = require("mongoose");
const ListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  connections: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ConnectionSelfie" },
  ],
  createdAt: { type: Date, default: Date.now },
});

const List = mongoose.model("List", ListSchema);

module.exports = List;
