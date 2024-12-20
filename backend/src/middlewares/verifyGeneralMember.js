const verifyGeneralMember = (req, res, next) => {
  try {
    const { role } = req.user;

    const validRoles = ["admin", "moderator", "member", "alumni"];
    if (!validRoles.includes(role)) {
      return res.status(403).json({
        message: "Access denied: Insufficient privileges",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.error("Error in verifyGeneralMember middleware:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = verifyGeneralMember;
