const mongoose = require("mongoose");
const Book = require("./Book-model");
const reviewScema = new mongoose.Schema(
  {
    rating: {
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
// to calc average rating
reviewScema.statics.calcAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingQuantity: 0,
      ratingAverage: 0,
    });
  }
};
reviewScema.post("save", function () {
  this.constructor.calcAverageRating(this.book);
});

reviewScema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "profile_img first_name last_name",
  });
  next();
});
const Review = mongoose.model("Review", reviewScema, "Review");
module.exports = Review;
