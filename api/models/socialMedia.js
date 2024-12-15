const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema({
  github: { type: String, default: null },
  x: { type: String, default: null }, // Twitter
  telegram: { type: String, default: null },
  linkedin: { type: String, default: null },
  wallet: { type: String, default: null },
  stackOverflow: { type: String, default: null },
  devto: { type: String, default: null },
  codepen: { type: String, default: null },
  codesandbox: { type: String, default: null },
  gitlab: { type: String, default: null },
  bitbucket: { type: String, default: null },
  medium: { type: String, default: null },
  hashnode: { type: String, default: null },
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  youtube: { type: String, default: null },
});

// Correctly define the model
module.exports = mongoose.model("SocialMedia", socialMediaSchema);
