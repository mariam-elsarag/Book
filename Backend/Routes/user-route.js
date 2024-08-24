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
    authController.checkUserId,
    userController.getUser
  )
  .patch(
    upload.none(),
    authController.protect,
    authController.checkUserId,
    userController.updateUser
  );

module.exports = router;
