// const validator = require("validator");
// const mongoose = require("mongoose");

const validateUpdateRoleData = (userId, newRole, banReason) => {
  const allowedRoles = ["admin", "moderator", "member", "alumni", "banned"];

  if (!allowedRoles.includes(newRole)) {
    return { isValid: false, message: "Enter a valid role" };
  }

  if (!userId) return { isValid: false, message: "Enter a user id" };

  if (banReason.length > 500) {
    return { isValid: false, message: "Limit reason to 500 characters" };
  }

  return {
    isValid: true,
  };
};

module.exports = { validateUpdateRoleData };
