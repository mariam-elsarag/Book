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
    authController.protect,
    authController.checkUserId,
    userController.deActivateUser
  )
  .delete(
    authController.protect,
    authController.checkUserId,
    userController.deleteUser
  )
  .patch(upload.none(), authController.protect, userController.updateUser);

module.exports = router;
