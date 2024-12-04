const resend = require("./config");
const {
  verificationTokenEmailTemplate,
  welcomeEmailTemplate,
} = require("./email-templates");
require("dotenv").config();

const sendVerificationTokenEmail = async (email, verificationToken) => {
  console.log(verificationTokenEmailTemplate);
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      //   to: [process.env.RESEND_TEST_EMAIL],
      to: [email],
      subject: "Verify Your Email Address",
      html: verificationTokenEmailTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
  } catch (error) {
    console.error("error sending verification email: " + error);
    throw new Error("error sending verification email");
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      //   to: [process.env.RESEND_TEST_EMAIL],
      to: [email],
      subject: "Welcome to the website!",
      html: welcomeEmailTemplate.replace("{name}", name),
    });
  } catch (error) {
    console.error("error sending welcome email: " + error);
    throw new Error("error sending welcome email");
  }
};

module.exports = { sendVerificationTokenEmail, sendWelcomeEmail };
