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

exports.userData = async (req, res) => {
  const userId = req.query.userId;
  try {
    const existingUser = await User.findOne({ _id: userId }).populate([
      { path: "socialMediaData" },
      {
        path: "lists",
        populate: {
          path: "connections",
          select: "-userId1",
          populate: {
            path: "userId2",
            select: "-email -password -onboardingLevel -lists ",
            populate: "socialMediaData",
          },
        },
      },
    ]);
    if (!existingUser) {
      return res.status(400).json({
        message: `User not found with the userId: ${userId} at profile`,
      });
    }
    //Sent data
    const userData = {
      name: existingUser.name,
      username: existingUser.username,
      socialMediaData: existingUser.socialMediaData,
      profilePhotoKey: existingUser.profilePhotoKey,
      lists: existingUser.lists,
      workplace: existingUser.workplace,
      description: existingUser.description,
    };
    return res
      .status(200)
      .json({ mesage: "User fetch successful", userData: userData });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: "An error occurred while fetching user Details",
    });
  }
};

exports.limiteduserData = async (req, res) => {
  const userId = req.query.userId;

  try {
    const existingUser = await User.findOne({ _id: userId }).populate({
      path: "socialMediaData",
    });
    if (!existingUser) {
      return res.status(400).json({
        message: `User not found with the userId: ${userId} at profile`,
      });
    }

    const userData = {
      name: existingUser.name,
      username: existingUser.username,
      socialMediaData: existingUser.socialMediaData,
      description: existingUser.description,
      profilePhotoKey: existingUser.profilePhotoKey,
      workplace: existingUser.workplace,
    };
    return res.status(200).json({
      ...userData,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: "An error occurred while fetching user Details",
    });
  }
};
