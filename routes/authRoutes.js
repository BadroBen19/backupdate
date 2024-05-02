const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

router
  .route("/sign_up")
  .post(authController.signUp)
  .get(authController.getSignup);
router.route("/login").post(authController.login).get(authController.getLogin);

module.exports = router;
