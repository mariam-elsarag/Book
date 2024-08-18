const express = require("express");
const multer = require("multer");

const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");

// multer
const upload = multer();

router.route("/register").post(upload.none(), authController.register);

router.route("/login").post(upload.none(), authController.login);

module.exports = router;
