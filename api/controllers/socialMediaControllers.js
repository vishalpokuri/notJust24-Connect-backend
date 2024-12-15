const SocialMedia = require("../models/socialMedia");

exports.create_links = async (req, res) => {
  try {
    const newProfile = new SocialMedia(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.get_links = async (req, res) => {
  try {
    const links = await SocialMedia.find();
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.get_links_by_username = async (req, res) => {
  try {
    const links = await SocialMedia.findOne({ username: req.params.username });
    if (!links) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete_link = async (req, res) => {
  try {
    const deletedProfile = await SocialMedia.findOneAndDelete({
      username: req.params.username,
    });
    if (!deletedProfile)
      return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update_link = async (req, res) => {
  try {
    const updatedProfile = await SocialMedia.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true } // Return the updated profile
    );
    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
