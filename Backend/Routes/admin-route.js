const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");
const adminController = require("../Controller/admin-controller");
// multer
const upload = multer();

router.use(authController.protect, authController.restrectTo("admin"));
router.route("/users").get(userController.getUsers);
router.route("/add-user").post(upload.none(), adminController.createUser);
router
  .route("/user/:id")
  .get(userController.getUser)
  .patch(
    userController.uploadUserImg,
    userController.resizeUserImg,
    userController.updateUser
  )
  .delete(userController.deleteUser);
module.exports = router;
