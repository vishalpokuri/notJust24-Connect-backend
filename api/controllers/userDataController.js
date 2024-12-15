const User = require("../models/User");

const socialMedia = require("../models/socialMedia");
require("dotenv").config();

exports.createUsername = async (req, res) => {
  const { email, username, name } = req.body;
  try {
    // Update user document with username, name, and onboardingLevel
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        username: username,
        name: name,
        onboardingLevel: 2,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating user" });
  }
};
exports.addSocials = async (req, res) => {
  const { telegram, x, linkedin, github, email } = req.body;

  try {
    // Find the user document
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: `User not found with the email: ${email}` });
    }
    const newSocialData = new socialMedia({
      x,
      linkedin,
      github,
      telegram,
    });
    await newSocialData.save();
    user.socialMediaData = newSocialData._id;
    user.onboardingLevel = 3;
    await user.save();
    res
      .status(200)
      .json({ message: "Social media details updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: "An error occurred while saving the social media details",
    });
  }
};
