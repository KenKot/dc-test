const express = require("express");
const authRouter = express.Router();

const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/auth-controller");

const verifyToken = require("../middlewares/verifyToken");

authRouter.post("/signup", signup);
authRouter.post("/verify-email", verifyEmail);

authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

authRouter.get("/check-auth", verifyToken, checkAuth);

module.exports = authRouter;
