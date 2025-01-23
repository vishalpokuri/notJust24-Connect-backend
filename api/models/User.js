const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
});
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  onboardingLevel: {
    type: Number,
    required: true,
  },
  socialMediaData: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "SocialMedia",
  },
  workplace: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  profilePhotoKey: {
    type: String,
    required: false,
  },
  currentRooms: [roomSchema],
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
});

module.exports = mongoose.model("User", userSchema);

/*
Onboarding levels
1 -> redirect At username and name creation
2 -> redirect to Socials
3 -> Profile and description
4 -> Fully onboarded (if 4 then Prompt to go for login page)

*/
/*
The current rooms shows up the list of rooms the person previously accessed, 
The model is to be in this way,
{
  roomId,
  isArchived, (two sections in the room, archived can be seen in another screen -> paid access)
}
*/
