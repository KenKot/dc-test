const express = require("express");
const adminRouter = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const verifyModeratorOrAdmin = require("../middlewares/verifyModeratorOrAdmin");
const { updateRole } = require("../controllers/admin-controller");

adminRouter.post(
  "/update-role",
  verifyToken,
  verifyModeratorOrAdmin,
  updateRole
);

module.exports = adminRouter;
