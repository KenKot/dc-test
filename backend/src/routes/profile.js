const express = require("express");
const profileRouter = express.Router();

const {
  getAllActiveMembers,
  getMemberById,
  getMemberByIdToEdit,
  updateMember,
} = require("../controllers/profile-controller");
const verifyGeneralMember = require("../middlewares/verifyGeneralMember");
const verifyTokenAndUser = require("../middlewares/verifyTokenAndUser");

profileRouter.get(
  "/profiles",
  verifyTokenAndUser,
  verifyGeneralMember,
  getAllActiveMembers
);

profileRouter.get(
  "/profile/edit",
  verifyTokenAndUser,
  verifyGeneralMember,
  getMemberByIdToEdit
);

profileRouter.post(
  "/profile/edit",
  verifyTokenAndUser,
  verifyGeneralMember,
  updateMember
);

profileRouter.get(
  "/profile/:id",
  verifyTokenAndUser,
  verifyGeneralMember,
  getMemberById
);

module.exports = profileRouter;
