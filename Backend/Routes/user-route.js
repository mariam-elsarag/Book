const express = require("express");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");

router.use(authController.protect);
router
  .route("/")
  .get(authController.getMe, userController.getUser)
  .patch(userController.uploadUserImg, userController.updateUser);
router.route("/:id").delete(userController.deleteUser);

router.route("/:id/deactivate").patch(userController.deActivateUser);
module.exports = router;
