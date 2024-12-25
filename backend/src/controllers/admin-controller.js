require("dotenv").config(); //testing

const User = require("../models/user");
const { sendWelcomeEmail } = require("../resend/email");

// Shouldnt be able to change user back to pending.
// Should send email after updating from pending to member

//since this sends email, it should be separate function
const updateRole = async (req, res) => {
  //as of now I have: req.id, and req.role because of middlewares
  try {
    const { userIdToUpdate, newRole } = req.body;

    if (!userIdToUpdate || !newRole) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and new role are required" });
    }

    const allowedRoles = ["moderator", "member", "alumni", "banned"];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const userToUpdate = await User.findById(userIdToUpdate);

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Role restrictions
    if (
      req.role === userToUpdate.role || // Prevent same-level updates
      (req.role === "moderator" && userToUpdate.role === "admin") || // Mods can't update admins
      (req.role === "moderator" && newRole === "moderator") // Mods can't promote to mod
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    // Prevent downgrading admins to non-admin roles
    if (
      req.role === "admin" &&
      newRole !== "admin" &&
      userToUpdate.role === "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Admins cannot downgrade other admins to non-admin roles.",
      });
    }

    const previousRole = userToUpdate.role;

    userToUpdate.role = newRole;
    await userToUpdate.save();

    if (previousRole === "pending") {
      await sendWelcomeEmail(userToUpdate.email, userToUpdate.firstname);
    }

    res.status(200).json({
      success: true,
      message: `User's role successfully updated to ${newRole}`,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res
      .status(500)
      .json({ success: false, message: "Unable to update user's role" });
  }
};

const getPendingMembers = async (req, res) => {
  //make them verify their email?
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
    if (req.role === "moderator") {
      currentMembers = await User.find({
        role: { $in: ["member", "alumni"] },
      }).select("firstname lastname email role");
    } else if (req.role === "admin") {
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
    res
      .status(500)
      .json({ success: false, message: "Unable to get current members" });
  }
};

const getBannedMembers = async (req, res) => {
  try {
    const bannedMembers = await User.find({ role: "banned" }).select(
      "firstname lastname email"
    );

    res.status(200).json({
      success: true,
      message: "Banned members successfully returned",
      bannedMembers,
    });
  } catch (error) {
    console.log(error);
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
