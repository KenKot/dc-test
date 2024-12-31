const crypto = require("crypto");

module.exports = () => {
  return crypto.randomBytes(3).toString("hex"); // 6 chars
};
