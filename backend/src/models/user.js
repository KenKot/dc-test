const mongoose = require("mongoose");
const validator = require("validator");

// add date of birth
// about me
//

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please provide a first name"],
      minLength: 2,
      maxLength: 22,
    },
    lastname: {
      type: String,
      required: [true, "Please provide a last name"],
      minLength: 2,
      maxLength: 22,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      isLowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email");
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      // Minimum Length: 8 characters.
      // At Least One Lowercase Letter.
      // At Least One Uppercase Letter.
      // At Least One Number.
      // At Least One Symbol.
    },
    isVerified: {
      // has user used the email code to verify it's actually their email?
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "member", "alumni", "pending", "banned"],
      default: "pending", // admin hasn't approved member yet
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    banDetails: {
      reason: { type: String, maxLength: 500 },
      issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
