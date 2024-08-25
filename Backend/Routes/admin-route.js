const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");
// multer
const upload = multer();
router
  .route("/users")
  .get(
    authController.protect,
    authController.restrectTo("admin"),
    userController.getUsers
  );
router
  .route("/add-user")
  .post(
    upload.none(),
    authController.protect,
    authController.restrectTo("admin"),
    userController.createUsers
  );
router
  .route("/user/:id")
  .get(
    authController.protect,
    authController.restrectTo("admin"),
    userController.getUser
  )
  .delete(
    authController.protect,
    authController.restrectTo("admin"),
    userController.deleteUser
  );
module.exports = router;
