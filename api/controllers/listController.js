const List = require("../models/list");
const User = require("../models/User");
require("dotenv").config();

exports.createListandUpdateInUser = async (req, res) => {
  const { userId, title } = req.body;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({
        message: `User not found with the given id: ${userId}`,
      });
    }
    const newList = new List({
      userId,
      title,
      connections: [],
    });
    await newList.save();
    //Push the list id to lists of user.
    user.lists.push(newList._id);

    await user.save();
    return res.status(200).json({
      message: "Created List and Updated in User successfully",
    });
  } catch (e) {
    return res.status(500).json({ message: `Unable to create List: ${e}` });
  }
};

exports.fetchListsbyUserId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.query.userId }).populate(
      "lists"
    );
    if (!user) {
      return res.status(400).json({
        message: `User not found with the given id: ${req.query.userId}`,
      });
    }
    return res.status(200).json({
      listData: user.lists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.uploadInList = async (req, res) => {
  const { listId, connectionId } = req.body;

  try {
    const updatedList = await List.findOneAndUpdate(
      { _id: listId },
      { $push: { connections: connectionId } },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({
        message: "Unable to update list",
      });
    }

    res.status(200).json({
      message: "List updated successfully",
      list: updatedList,
    });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
