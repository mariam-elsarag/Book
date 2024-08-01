const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
    maxlength: [100, "You exceed max length for title, 100 characters"],
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    maxlength: [80, "You exceed max length for author name, 80 characters"],
  },
  price: {
    type: Number,
    required: [true, "Book price is required"],
  },
  published_year: {
    type: Number,
    required: [true, "Book published year is required"],
  },
});

const Book = mongoose.model("book", bookSchema, "books");
module.exports = Book;
