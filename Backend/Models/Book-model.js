const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      maxlength: [100, "You exceed max length for title, 100 characters"],
    },
    genre: {
      type: mongoose.Schema.ObjectId,
      ref: "Genre",
      require: [true, "Book genre is required"],
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
      min: [1000, "Published year must be after the year 1000"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 1"],
      max: [5, "Rating must be below 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// virtual populate for reviews
bookSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "book",
  localField: "_id",
});
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: "genre",
  });
  next();
});
const Book = mongoose.model("book", bookSchema, "books");
module.exports = Book;
