const express = require("express");
const authRouter = express.Router();

const {
  signup,
  login,
  logout,
  verifyEmail,
} = require("../controllers/auth-controller");

authRouter.post("/signup", signup);
authRouter.post("/verify-email", verifyEmail);

authRouter.post("/login", login);
authRouter.post("/logout", logout);

module.exports = authRouter;
