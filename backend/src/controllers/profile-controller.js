const User = require("../models/user");
const logger = require("../utils/logger"); // Import the logger

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

    logger.info("All active users returned successfully"); // Log success message
  } catch (error) {
    logger.error("Error getting all active users: " + error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Failed retrieving users" });
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

    logger.info(`Member returned successfully: ${member._id}`); // Log success message
  } catch (error) {
    logger.error("Error getting member by id: " + error); // Log error using logger
    res.status(500).json({ success: false, message: "Failed retrieving user" });
  }
};

// Returns more sensitive data than "getMemberById", for only logged-in user to see
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

    logger.info(`Member returned successfully for edit: ${req.user._id}`); // Log success message
  } catch (error) {
    logger.error("Error getting member to edit by id: " + error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Failed retrieving member" });
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

    logger.info("Profile updated successfully"); // Log success message (for progress)
  } catch (error) {
    logger.error("Error updating profile: " + error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Failed retrieving member" });
  }
};

module.exports = {
  getAllActiveMembers,
  getMemberById,
  getMemberByIdToEdit,
  updateProfile,
};
