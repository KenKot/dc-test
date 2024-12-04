const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendVerificationTokenEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../resend/email");

const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substring(7);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    res.cookie("token", token, {
      httpOnly: true, // cookie cannot be accessed by client
      secure: process.env.NODE_ENV === "production", // cookie can only be sent over HTTPS
      sameSite: "strict", // cookie is not sent if the website is on a different domain
      maxAage: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await sendVerificationTokenEmail(user.email, verificationToken); // resend/email.js

    res.status(201).json({
      message: "User created successfully",
      user: {
        firstname: user.first,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;

  try {
    const user = await User.findOne({
      verificationToken,
      verificationExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.firstname); // resend/email.js

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error verifying email: " + error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isVerified = user.isVerified;

    if (!isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    res.cookie("token", token, {
      httpOnly: true, // cookie cannot be accessed by client
      secure: process.env.NODE_ENV === "production", // cookie can only be sent over HTTPS
      sameSite: "strict", // cookie is not sent if the website is on a different domain
      maxAage: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log("error logging in: " + error);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetPasswordToken = Math.random().toString(36).substring(7);
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    ); // resend/email.js

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log("error sending password reset email: " + error);
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);
  } catch (error) {
    console.log("error resetting password: " + error);
    res.status(500).json({ message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    if (!user) {
      res.status(400).json({ message: "user not found" });
    }

    res
      .status(200)
      .json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isVerified: user.isVerified,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "unauthorized" });
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
