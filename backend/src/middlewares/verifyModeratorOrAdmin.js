// Verifies requester is "moderator" or "admin",
// stores requester on the Request object as well

const User = require("../models/user");

const verifyModeratorOrAdmin = async (req, res, next) => {
  try {
    // const user = await User.findById(req.id);

    // if (!user) {
    //   return res.status(400).json({
    //     message: "Invalid user",
    //     success: false,
    //   });
    // }

    const user = req.user;

    if (user.role !== "moderator" && user.role !== "admin") {
      return res.status(400).json({
        message: "Improper role",
        success: false,
      });
    }

    // req.role = user.role;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyModeratorOrAdmin;
