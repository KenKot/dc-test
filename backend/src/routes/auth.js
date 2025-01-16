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

const verifyTokenAndUser = require("../middlewares/verifyTokenAndUser");

const rateLimit = require("express-rate-limit");
const resetPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1, // 1 request per window per IP
  message: "You can only request a password reset once every 10 minutes.",
});

authRouter.post("/signup", signup);
authRouter.post("/verify-email", verifyEmail);

authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/forgot-password", resetPasswordLimiter, forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

authRouter.get("/check-auth", verifyTokenAndUser, checkAuth);

module.exports = authRouter;
