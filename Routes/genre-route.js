const express = require("express");
const multer = require("multer");

const router = express.Router();
// multer
const upload = multer();
// controller
const genreController = require("../Controller/book-genre-controller");
const authController = require("../Controller/auth-controller");

router
  .route("/")
  .get(genreController.getGenres)
  .post(
    upload.none(),
    authController.protect,
    authController.restrectTo("admin"),
    genreController.createGenre
  );
router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrectTo("admin"),
    genreController.deleteGenre
  );
module.exports = router;
