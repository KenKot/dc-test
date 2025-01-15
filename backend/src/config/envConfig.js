require("dotenv").config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  MONGO_URI,
  PORT,
  RESEND_API_KEY,
  CLIENT_URL,
  JWT_SECRET,
  NODE_ENV,
};
