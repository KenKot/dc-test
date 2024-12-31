const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to verify JWT and attach user to request
const verifyTokenAndUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedObj;

    // Find the user in the database
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in verifyToken middleware: ", err.message);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Token expired" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = verifyTokenAndUser;
