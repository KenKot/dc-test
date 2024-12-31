const verifyGeneralMember = (req, res, next) => {
  try {
    const { role } = req.user;

    const validRoles = ["admin", "moderator", "member", "alumni"];
    if (!validRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient privileges",
      });
    }

    next();
  } catch (error) {
    console.error("Error in verifyGeneralMember middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = verifyGeneralMember;
