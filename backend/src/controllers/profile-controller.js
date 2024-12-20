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
    res
      .status(500)
      .json({ success: false, message: "Failed retreiving users" });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await User.findById(id).select("firstname lastname role");

    res.status(200).json({
      success: true,
      message: "Member returned successfully",
      member,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed retreiving users" });
  }
};

//returns more sensitive data than "getMemberById" for only logged in user to see,
//doesn't id in params like getMemberById

//I might already have the user info I want on the User Store,
// so this function might be redundant
const getMemberByIdToEdit = async (req, res) => {
  try {
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
    res
      .status(500)
      .json({ success: false, message: "Failed retreiving member" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const member = {
      id: req.user._id,
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
