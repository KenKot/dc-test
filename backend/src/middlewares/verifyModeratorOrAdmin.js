// Verifies requester is "moderator" or "admin",

const User = require("../models/user");

const logger = require("../utils/logger");
const verifyModeratorOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "moderator" && req.user.role !== "admin") {
      return res.status(400).json({
        message: "Improper role",
        success: false,
      });
    }

    next();
  } catch (error) {
    logger.error("Error in 'verifyModeratorOrAdmin middleware: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyModeratorOrAdmin;
