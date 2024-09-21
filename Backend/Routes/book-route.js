const express = require("express");

const router = express.Router();
// controller
const bookController = require("../Controller/book-controller");
const authController = require("../Controller/auth-controller");
const reviewController = require("../Controller/review-controller");

// rotue
const reviewRoute = require("./review-route");
const favoriteRoute = require("./favorite-route");

router.use(authController.protect);
router
  .route("/")
  .get(authController.toggleAuth, bookController.getBooks)
  .post(
    authController.restrectTo("admin"),
    bookController.uploadBookImages,
    bookController.resizeBookImages,
    bookController.createBook
  );

router
  .route("/:id")
  .get(authController.toggleAuth, bookController.getBook)
  .patch(
    authController.restrectTo("admin"),
    bookController.uploadBookImages,
    bookController.resizeBookImages,
    bookController.updateBook
  )
  .delete(authController.restrectTo("admin"), bookController.deleteBook);

// reviews
router.use("/:id/review", reviewRoute);

// // favorite
router.use("/:bookId/favorite", favoriteRoute);
module.exports = router;
