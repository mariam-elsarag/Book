const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const userController = require("../Controller/user-controller");

// multer
const upload = multer();

router.route("/all").get(authController.protect, userController.getUsers);

module.exports = router;
