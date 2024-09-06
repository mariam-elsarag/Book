const express = require("express");
// controller
const authController = require("../Controller/auth-controller");
const favoriteController = require("../Controller/favorite-controller");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .patch(authController.protect, favoriteController.ToggleFavorite);
router.route("/").get(authController.protect, favoriteController.getFavorite);

module.exports = router;
