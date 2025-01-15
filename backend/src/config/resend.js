const { Resend } = require("resend");
const { RESEND_API_KEY } = require("../config/envConfig");

const resend = new Resend(RESEND_API_KEY);

module.exports = resend;
