const express = require("express");
const profileRouter = express.Router();

const {
  getAllActiveMembers,
  getMemberById,
  getMemberByIdToEdit,
  updateProfile,
} = require("../controllers/profile-controller");
const verifyGeneralMember = require("../middlewares/verifyGeneralMember");
const verifyTokenAndUser = require("../middlewares/verifyTokenAndUser");

profileRouter.get(
  "/profiles",
  // verifyTokenAndUser
  // verifyGeneralMember,
  getAllActiveMembers
);

profileRouter.get(
  "/profile/edit",
  verifyTokenAndUser,
  verifyGeneralMember,
  getMemberByIdToEdit
);

profileRouter.patch(
  "/profile/edit",
  verifyTokenAndUser,
  verifyGeneralMember,
  updateProfile
);

profileRouter.get(
  "/profile/:id",
  verifyTokenAndUser,
  verifyGeneralMember,
  getMemberById
);

module.exports = profileRouter;
