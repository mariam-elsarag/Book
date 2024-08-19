const express = require("express");
const multer = require("multer");
const authController = require("../Controller/auth-controller");

const router = express.Router();
const upload = multer();

// Routes
router.route("/register").post(upload.none(), authController.register);

router.route("/login").post(upload.none(), authController.login);

module.exports = router;
