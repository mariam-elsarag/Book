const mongoose = require("mongoose");
const reviewScema = new mongoose.Schema(
  {
    ratting: {
      type: Number,
      max: 5,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    review: {
      type: String,
      require: [true, "Review can't be empty"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      require: [true, "Review must belong to a user"],
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "book",
      require: [true, "Review must belong to a book"],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Review = mongoose.model("Review", reviewScema, "Reviews");
module.exports = Review;
