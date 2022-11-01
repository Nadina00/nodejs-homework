const express = require("express");

const router = express.Router();

const {
  registrationCont,
  loginCont,
  updateStatusSub,
  logoutCont,
} = require("../../controllers/authControllers");

const { tokenMidleware } = require("../../middlewares/authMidleware");

router.post("/signup", registrationCont);

router.post("/login", loginCont);

router.get("/current", tokenMidleware);

router.get("/logout", logoutCont);

router.patch("/:id", updateStatusSub);

module.exports = router;
