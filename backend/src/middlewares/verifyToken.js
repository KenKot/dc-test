const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token and handle errors
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("Token expired:", err.message);
          return res
            .status(401)
            .json({ message: "Unauthorized: Token expired" });
        }
        console.error("Token verification error:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      // Token is valid; attach the user ID to the request object
      req.id = decoded.id;
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyToken;
