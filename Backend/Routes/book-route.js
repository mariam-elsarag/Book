const express = require("express");
const multer = require("multer");

const router = express.Router();
// controller
const bookController = require("../Controller/book-controller");
const authController = require("../Controller/auth-controller");

// multer
const upload = multer();
router
  .route("/")
  .get(bookController.getBooks)
  .post(
    upload.none(),
    authController.protect,
    authController.restrectTo("admin"),
    bookController.createBook
  );

router
  .route("/:id")
  .get(bookController.getBook)
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

module.exports = router;
