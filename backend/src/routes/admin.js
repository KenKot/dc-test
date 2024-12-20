const express = require("express");
const adminRouter = express.Router();

const verifyTokenAndUser = require("../middlewares/verifyTokenAndUser");
const verifyModeratorOrAdmin = require("../middlewares/verifyModeratorOrAdmin");
const { updateRole } = require("../controllers/admin-controller");

adminRouter.post(
  "/update-role",
  verifyTokenAndUser,
  verifyModeratorOrAdmin,
  updateRole
);

module.exports = adminRouter;
