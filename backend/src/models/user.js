const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastname: {
      type: String,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "member", "alumni", "pending", "banned"],
      default: "pending",
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
