const express = require("express");

const router = express.Router();

const {
  registrationCont,
  loginCont,
  updateStatusSub,
  currentUser,
  logoutCont,
} = require("../../controllers/authControllers");

const { tokenMidleware } = require("../../middlewares/authMidleware");

router.post("/signup", registrationCont);

router.post("/login", loginCont);

router.get("/current", tokenMidleware, currentUser);

router.get("/logout", tokenMidleware, logoutCont);

router.patch("/:id", tokenMidleware, updateStatusSub);

module.exports = router;
