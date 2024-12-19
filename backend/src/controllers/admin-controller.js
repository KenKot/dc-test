require("dotenv").config(); //testing

const User = require("../models/user");
const { sendWelcomeEmail } = require("../resend/email");

// Shouldnt be able to change user back to pending.
// Should send email after updating from pending to member
//

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

    // admins can't update admins, mods can't update mods, mods can't update admins
    if (
      req.role === userToUpdate.role ||
      (req.role === "moderator" && userToUpdate.role === "admin")
    ) {
      return res.status(500).json({ success: false, message: "Invalid role" });
    }

    //mods can't update users to mods
    if (req.role === "moderator" && newRole == "moderator") {
      return res.status(500).json({ success: false, message: "Invalid role" });
    }

    const previousRole = userToUpdate.role;

    userToUpdate.role = newRole;
    await userToUpdate.save();

    // changing role from "pending" to something else is the only time we want to send welcome email
    if (previousRole === "pending") {
      //send welcome email
      //   await sendWelcomeEmail(userToUpdate.firstname, userToUpdate.role);
      await sendWelcomeEmail(
        process.env.RESEND_TEST_EMAIL,
        userToUpdate.firstname
      ); //for testing (resend cant send emails to other emails)
    }

    res.status(201).json({
      success: true,
      message: `User's role successfuly updated to ${newRole} `,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to update user's role" });
  }
};

module.exports = { updateRole };
