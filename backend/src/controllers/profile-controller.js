const User = require("../models/user");

const getAllActiveMembers = async (req, res) => {
  try {
    const activeMembers = await User.find({
      role: { $nin: ["pending", "banned"] },
    }).select("firstname lastname role");

    res.status(200).json({
      success: true,
      message: "All active users returned successfully",
      activeMembers,
    });
  } catch (error) {
    console.log("Error getting all active users: " + error);
    res
      .status(500)
      .json({ success: false, message: "Failed retreiving users" });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await User.findById(id).select("firstname lastname role");

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "No member found" });
    }

    res.status(200).json({
      success: true,
      message: "Member returned successfully",
      member,
    });
  } catch (error) {
    console.log("Error getting member by id: " + error);
    res.status(500).json({ success: false, message: "Failed retreiving user" });
  }
};

//returns more sensitive data than "getMemberById", for only logged in user to see,
//doesn't id in params like getMemberById

const getMemberByIdToEdit = async (req, res) => {
  try {
    // Prune this such as: password, verificationToken, etc.

    // User document already on req object
    const member = {
      _id: req.user._id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
    };

    res.status(200).json({
      success: true,
      message: "Member returned successfully",
      member,
    });
  } catch (error) {
    console.log("Error getting member to edit by id: " + error);
    res
      .status(500)
      .json({ success: false, message: "Failed retreiving member" });
  }
};

// IN PROGRESS
const updateProfile = async (req, res) => {
  try {
    // const {DateofBirth, aboutme} = req.body;     // don't let them edit f/lastname? Let admin see old name?

    // const member = {
    //   id: req.user._id,
    //   firstname: req.user.firstname,
    //   lastname: req.user.lastname,
    //   email: req.user.email,
    // };

    res.status(200).json({
      success: true,
      message: "Member returned successfully",
      member,
    });
  } catch (error) {
    console.log("Error updating profile: " + error);
    res
      .status(500)
      .json({ success: false, message: "Failed retreiving member" });
  }
};

module.exports = {
  getAllActiveMembers,
  getMemberById,
  getMemberByIdToEdit,
  updateProfile,
};
