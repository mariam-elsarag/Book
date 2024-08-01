const express = require("express");
const multer = require("multer");

const router = express.Router();
// controller
const bookController = require("../Controller/book-controller");

// multer
const upload = multer();
router
  .route("/")
  .get(bookController.getBooks)
  .post(upload.none(), bookController.createBook);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(upload.none(), bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
