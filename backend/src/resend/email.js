const resend = require("../config/resend");
const {
  verificationTokenEmailTemplate,
  welcomeEmailTemplate,
} = require("./email-templates");
const logger = require("../utils/logger");
const { CLIENT_URL } = require("../config/envConfig");

const sendVerificationTokenEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Delta Chi East Bay <sender@kenkot.net>",
      // from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address",
      html: `Here is your activation code: ${verificationToken}<br>You can click <a href="${CLIENT_URL}/verify-email">here</a> to enter your activation code if you have closed the window.`,
      // html: verificationTokenEmailTemplate.replace(
      //   "{verificationToken}",
      //   verificationToken
      // ),
    });
    logger.info(`Verification token sent to ${email}`); // Log success message
  } catch (error) {
    logger.error("Error sending verification email: " + error); // Log error using logger
    throw new Error("Error sending verification email");
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      // from: "Acme <onboarding@resend.dev>",
      from: "Delta Chi East Bay <sender@kenkot.net>",
      to: [email],
      subject: "Welcome to the website!",
      // html: welcomeEmailTemplate.replace("{name}", name),
      html: `Welcome to Delta Chi East Bay ${name}! We're glad to have you!`,
    });
    logger.info(`Welcome email sent to ${email}`); // Log success message
  } catch (error) {
    logger.error("Error sending welcome email: " + error); // Log error using logger
    throw new Error("Error sending welcome email");
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
    logger.info(`Password reset email sent to ${email}`); // Log success message
  } catch (error) {
    logger.error("Error sending password reset email: " + error); // Log error using logger
    throw new Error("Error sending password reset email");
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
    logger.info(`Password reset success email sent to ${email}`); // Log success message
  } catch (error) {
    logger.error("Error sending reset success email: " + error); // Log error using logger
    throw new Error("Error sending reset success email");
  }
};

module.exports = {
  sendVerificationTokenEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
