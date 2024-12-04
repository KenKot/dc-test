const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedJWT = jwt.decode(token, process.env.JWT_SECRET);
    if (!decodedJWT) {
      res.status(401).json({ message: "Unauthorized" });
    }

    req.id = decodedJWT.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;
