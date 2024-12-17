const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("User", userSchema);

/*
Onboarding levels
1 -> redirect At username and name creation
2 -> redirect to Socials
3 -> Profile and description
4 -> Fully onboarded (if 4 then Prompt to go for login page)

*/
