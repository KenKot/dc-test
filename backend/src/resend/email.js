const resend = require("./config");
const {
  verificationTokenEmailTemplate,
  welcomeEmailTemplate,
} = require("./email-templates");
require("dotenv").config();

const sendVerificationTokenEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Delta Chi East Bay <sender@kenkot.net>",
      // from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address",
      html: `Here is your activation code: ${verificationToken}<br>You can click <a href="${process.env.CLIENT_URL}/verify-email">here</a> to enter your activation code if you have closed the window.`,
      // html: verificationTokenEmailTemplate.replace(
      //   "{verificationToken}",
      //   verificationToken
      // ),
    });
  } catch (error) {
    console.error("error sending verification email: " + error);
    throw new Error("error sending verification email");
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      // from: "Acme <onboarding@resend.dev>",
      from: "Delta Chi East Bay <sender@kenkot.net>",
      to: [email],
      subject: "Welcome to the website!",
      html: welcomeEmailTemplate.replace("{name}", name),
    });
  } catch (error) {
    console.error("error sending welcome email: " + error);
    throw new Error("error sending welcome email");
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      // from: "Acme <onboarding@resend.dev>",
      from: "Delta Chi East Bay <sender@kenkot.net>",
      to: [email],
      subject: "Reset your password",
      html: `Click <a href="${resetURL}">here</a> to reset your password`,
    });
  } catch (error) {
    console.error("error sending password reset email: " + error);
    throw new Error("error sending password reset email");
  }
};

const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      // from: "Acme <onboarding@resend.dev>",
      from: "Delta Chi East Bay <sender@kenkot.net>",
      to: [email],
      subject: "Password reset was successful",
      html: `Your password was reset successfully`,
    });
  } catch (error) {
    console.error("error sending reset success email: " + error);
    throw new Error("error sending reset success email");
  }
};

module.exports = {
  sendVerificationTokenEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
