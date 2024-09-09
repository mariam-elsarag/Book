const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");

// multer
const upload = multer();
router.use(authController.protect);
router.route("/").get(authController.getMe, userController.getUser);
router
  .route("/:id")
  .patch(userController.deActivateUser)
  .delete(userController.deleteUser)
  .patch(upload.none(), userController.updateUser);

module.exports = router;
