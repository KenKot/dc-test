const express = require("express");
const adminRouter = express.Router();

const verifyTokenAndUser = require("../middlewares/verifyTokenAndUser");
const verifyModeratorOrAdmin = require("../middlewares/verifyModeratorOrAdmin");
const {
  updateRole,
  getPendingMembers,
  getCurrentMembers,
  getBannedMembers,
} = require("../controllers/admin-controller");

adminRouter.post(
  "/update-role",
  verifyTokenAndUser,
  verifyModeratorOrAdmin,
  updateRole
);

adminRouter.get(
  "/pending-members",
  verifyTokenAndUser,
  verifyModeratorOrAdmin,
  getPendingMembers
);

adminRouter.get(
  "/current-members",
  verifyTokenAndUser,
  verifyModeratorOrAdmin,
  getCurrentMembers
);

adminRouter.get(
  "/banned-members",
  verifyTokenAndUser,
  verifyModeratorOrAdmin,
  getBannedMembers
);
module.exports = adminRouter;
