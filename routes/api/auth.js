const express = require("express");

const router = express.Router();

const {
  registrationCont,
  loginCont,
  updateStatusSub,
  currentUser,
  userAvatar,
  logoutCont,
} = require("../../controllers/authControllers");

const { tokenMidleware } = require("../../middlewares/authMidleware");
const { uploadMidleware } = require("../../middlewares/uploadMidleware");

router.post("/signup", registrationCont);

router.post("/login", loginCont);

router.get("/current", tokenMidleware, currentUser);

router.get("/logout", tokenMidleware, logoutCont);

router.patch("/:id", tokenMidleware, updateStatusSub);

router.patch(
  "/avatars/:id",
  tokenMidleware,
  uploadMidleware.single("avatar"),
  userAvatar
);

module.exports = router;
