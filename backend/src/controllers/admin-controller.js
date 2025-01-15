const User = require("../models/user");
const { sendWelcomeEmail } = require("../resend/email");
const {
  validateUpdateRoleData,
  validateUpdateRoleRestrictions,
} = require("../utils/validations/adminValidations");
const logger = require("../utils/logger");

const updateRole = async (req, res) => {
  try {
    const { userIdToUpdate, newRole, banReason } = req.body;
    const updateRoleFormValidation = validateUpdateRoleData(
      userIdToUpdate,
      newRole,
      banReason
    );

    if (!updateRoleFormValidation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: updateRoleFormValidation.message });
    }

    const userToUpdate = await User.findById(userIdToUpdate);

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Role restriction checks
    const roleRestrictionValidation = validateUpdateRoleRestrictions(
      req.user.role,
      userToUpdate.role,
      newRole
    );

    if (!roleRestrictionValidation.isValid) {
      return res
        .status(403)
        .json({ success: false, message: roleRestrictionValidation.message });
    }

    const previousRole = userToUpdate.role;
    userToUpdate.role = newRole;

    // If we are banning the user, set ban details
    if (newRole === "banned") {
      userToUpdate.banDetails = {
        reason: banReason || "No reason specified",
        issuedBy: req.user._id, // The admin or moderator banning the user
        date: new Date(),
      };
    } else if (previousRole === "banned") {
      //  clear banDetails if unbanning or changing to a different role
      userToUpdate.banDetails = undefined;
    }

    await userToUpdate.save();

    // send welcome email if they're a new user
    if (previousRole === "pending") {
      await sendWelcomeEmail(userToUpdate.email, userToUpdate.firstname);
    }

    res.status(200).json({
      success: true,
      message: `User's role successfully updated to ${newRole}`,
    });
    logger.info(`User's role successfully updated to ${newRole}`); // Log the successful role update
  } catch (error) {
    logger.error("Error updating role:", error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Unable to update user's role" });
  }
};

const getPendingMembers = async (req, res) => {
  try {
    const pendingMembers = await User.find({
      role: "pending",
      isVerified: true,
    }).select("firstname lastname email");

    res.status(200).json({
      success: true,
      message: "Pending members successfully returned",
      pendingMembers,
    });
  } catch (error) {
    logger.error("Error getting pending members:", error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Unable to get pending members" });
  }
};

const getCurrentMembers = async (req, res) => {
  try {
    let currentMembers;

    //moderators only can change members/alumni
    //admin can do everything except demote an admin
    if (req.user.role === "moderator") {
      currentMembers = await User.find({
        role: { $in: ["member", "alumni"] },
      }).select("firstname lastname email role");
    } else if (req.user.role === "admin") {
      currentMembers = await User.find({
        role: { $in: ["moderator", "member", "alumni"] },
      }).select("firstname lastname email role");
    }

    res.status(200).json({
      success: true,
      message: "Current members successfully returned",
      currentMembers,
    });
  } catch (error) {
    logger.error("Error getting current members", error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Unable to get current members" });
  }
};

const getBannedMembers = async (req, res) => {
  try {
    const bannedMembers = await User.find({ role: "banned" })
      .select("firstname lastname email banDetails")
      .populate("banDetails.issuedBy", "firstname lastname");

    res.status(200).json({
      success: true,
      message: "Banned members successfully returned",
      bannedMembers,
    });
  } catch (error) {
    logger.error("Error getting banned members:", error); // Log error using logger
    res
      .status(500)
      .json({ success: false, message: "Unable to get banned members" });
  }
};

module.exports = {
  updateRole,
  getPendingMembers,
  getCurrentMembers,
  getBannedMembers,
};
