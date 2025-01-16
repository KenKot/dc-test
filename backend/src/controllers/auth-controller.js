const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendVerificationTokenEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../resend/email");

const generateToken = require("../utils/generateToken.js");
const {
  validateSignUpData,
  validateLoginData,
  validateForgotPasswordData,
  validateResetPasswordData,
} = require("../utils/validations/authValidations.js");

const logger = require("../utils/logger");

const { CLIENT_URL, NODE_ENV, JWT_SECRET } = require("../config/envConfig.js");

const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const signUpValidation = validateSignUpData(
      firstname,
      lastname,
      email,
      password
    );

    if (!signUpValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: signUpValidation.message,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateToken();

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await sendVerificationTokenEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
    });

    logger.info(`User created: ${user.email}`); // Log the successful signup
  } catch (error) {
    logger.error("Error signing up user: " + error); // Log the error during signup
    res.status(500).json({ success: false, message: "Unable to sign up user" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.body;

    const user = await User.findOne({
      verificationToken,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "14d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });

    logger.info(`Email verified: ${user.email}`); // Log email verification success
  } catch (error) {
    logger.error("Error verifying email: " + error); // Log error during email verification
    res.status(500).json({ success: false, message: "Unable to verify user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginValidation = validateLoginData(email, password);

    if (!loginValidation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: loginValidation.message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isVerified = user.isVerified;

    if (!isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email not verified" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "14d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });

    logger.info(`User logged in: ${user.email}`); // Log login success
  } catch (error) {
    logger.error("Error logging in: " + error); // Log error during login
    res.status(500).json({ success: false, message: "Unable to log in" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
    logger.info("User logged out"); // Log successful logout
  } catch (error) {
    logger.error("Error during logout: ", error); // Log error during logout
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const forgotPasswordValidation = validateForgotPasswordData(email);

    if (!forgotPasswordValidation.isValid)
      return res
        .status(400)
        .json({ success: false, message: forgotPasswordValidation.message });

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetPasswordToken = generateToken();
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${CLIENT_URL}/reset-password/${resetPasswordToken}`
    );

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });

    logger.info(`Password reset email sent: ${user.email}`); // Log reset email sent
  } catch (error) {
    logger.error("Error sending password reset email: " + error); // Log error sending reset email
    res.status(500).json({
      success: false,
      message: "Unable to complete forgot password process",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordValidation = validateResetPasswordData(password);

    if (!resetPasswordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: resetPasswordValidation.message,
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });

    logger.info(`Password reset successful: ${user.email}`); // Log password reset success
  } catch (error) {
    logger.error("Error resetting password: " + error); // Log error during password reset
    res
      .status(500)
      .json({ success: false, message: "Unable to update password" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      message: "Checked authorization successfully",
    });

    logger.info(`User authorization checked: ${user.email}`); // Log user authorization check
  } catch (error) {
    logger.error("Error checking user's auth: " + error); // Log error checking authorization
    res.status(400).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};
