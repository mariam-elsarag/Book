const express = require("express");
const multer = require("multer");

// controllers
const authController = require("../Controller/auth-controller");
const reviewController = require("../Controller/review-controller");

const router = express.Router({ mergeParams: true });

const upload = multer();

router
  .route("/")
  .get(authController.protect, reviewController.allReviews)
  .post(
    upload.none(),
    authController.protect,
    authController.restrectTo("user"),
    reviewController.createReview
  );

router
  .route("/:id")
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
