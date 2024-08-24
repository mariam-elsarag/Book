const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");

// multer
const upload = multer();

router
  .route("/:id")
  .get(
    authController.protect,
    authController.checkUser,
    userController.getUser
  );

router
  .route("/forget-password")
  .post(upload.none(), authController.forgetPassword);

// router
//   .route("/reset-password/:token")
//   .patch(upload.none(), authController.res);

module.exports = router;
