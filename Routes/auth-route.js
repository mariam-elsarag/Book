const express = require("express");
const multer = require("multer");
const authController = require("../Controller/auth-controller");

const router = express.Router();
const upload = multer();

// Routes
router.route("/register").post(upload.none(), authController.register);

router.route("/login").post(upload.none(), authController.login);

router
  .route("/forget-password")
  .post(upload.none(), authController.forgetPassword);

router
  .route("/reset-password/:token")
  .patch(upload.none(), authController.resetPassword);

router
  .route("/change-password")
  .patch(upload.none(), authController.protect, authController.updatePassword);

module.exports = router;
