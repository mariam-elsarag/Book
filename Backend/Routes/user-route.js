const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");

// multer
const upload = multer();

router
  .route("/all")
  .get(
    authController.protect,
    authController.restrectTo("admin"),
    userController.getUsers
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrectTo("admin"),
    userController.deleteUser
  );
module.exports = router;
