const express = require("express");
const multer = require("multer");

const router = express.Router();
// controller
const bookController = require("../Controller/book-controller");
const authController = require("../Controller/auth-controller");

// rotue
const reviewRoute = require("./review-route");
const favoriteRoute = require("./favorite-route");
// multer
const upload = multer();
router
  .route("/")
  .get(authController.toggleAuth, bookController.getBooks)
  .post(
    upload.none(),
    authController.protect,
    authController.restrectTo("admin"),
    bookController.createBook
  );

router
  .route("/:id")
  .get(authController.toggleAuth, bookController.getBook)
  .patch(
    upload.none(),
    authController.protect,
    authController.restrectTo("admin"),
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrectTo("admin"),
    bookController.deleteBook
  );

// reviews
router.use("/:bookId/review", reviewRoute);
// // favorite
router.use("/:bookId/favorite", favoriteRoute);
module.exports = router;
