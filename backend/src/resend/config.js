const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.SENDGRID_API_KEY);

module.exports = resend;
