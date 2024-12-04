const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendVerificationTokenEmail,
  sendWelcomeEmail,
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

const login = (req, res) => {
  res.send("login route!");
};

const logout = (req, res) => {
  res.send("logout route!");
};

module.exports = { signup, login, logout, verifyEmail };
