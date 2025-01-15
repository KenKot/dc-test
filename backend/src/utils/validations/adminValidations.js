// const validator = require("validator");
// const mongoose = require("mongoose");

const validateUpdateRoleData = (userId, userToUpdateRole, banReason) => {
  const allowedRoles = ["admin", "moderator", "member", "alumni", "banned"];

  if (!userId || !userToUpdateRole)
    return { isValid: false, message: "Include userId and role" };

  if (!allowedRoles.includes(userToUpdateRole)) {
    return { isValid: false, message: "Enter a valid role" };
  }

  if (banReason && banReason.length > 500) {
    return { isValid: false, message: "Limit reason to 500 characters" };
  }

  return {
    isValid: true,
  };
};

const validateUpdateRoleRestrictions = (
  requesterRole,
  userToUpdateRole,
  newRole
) => {
  if (!requesterRole || !userToUpdateRole || !newRole) {
    return { isValid: false, message: "Invalid input for role validation" };
  }

  // Mods cannot update other mods or admins
  if (
    requesterRole === "moderator" &&
    (userToUpdateRole === "admin" ||
      userToUpdateRole === "moderator" ||
      newRole === "moderator")
  ) {
    return {
      isValid: false,
      message: "Moderators cannot ban or promote admins/moderators",
    };
  }

  // Admins cannot demote or ban other admins
  if (
    requesterRole === "admin" &&
    userToUpdateRole === "admin" &&
    newRole !== "admin"
  ) {
    return {
      isValid: false,
      message: "Admins cannot demote or ban other admins.",
    };
  }

  // If none of the above rules are violated
  return { isValid: true };
};

module.exports = { validateUpdateRoleData, validateUpdateRoleRestrictions };
