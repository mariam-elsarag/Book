const express = require("express");
const multer = require("multer");

// controllers
const authController = require("../Controller/auth-controller");
const reviewController = require("../Controller/review-controller");

const router = express.Router();

const upload = multer();

router
  .route("/")
  .get(authController.protect, reviewController.allReviews)
  .post(upload.none(), authController.protect, reviewController.createReview);

module.exports = router;
