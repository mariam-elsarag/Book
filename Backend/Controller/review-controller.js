// model
const Review = require("../Models/Review-model");
// utils
const httpStatusText = require("../utils/httpStatusText");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Pagination = require("../utils/Pagination");

// all reviews
exports.allReviews = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const features = new Pagination(1, 10, Review.find({ book: bookId }));
  const reviews = await features.getPagination(Review);

  res.status(200).json({ status: httpStatusText.status, ...reviews });
});

// create review
exports.createReview = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { rate, review } = req.body;
  let errors = [];
  if (!rate) {
    errors.push({ rate: "Rate is required" });
  }
  if (!review) {
    errors.push({ review: "Review is required" });
  }

  if (errors?.length > 0) {
    return next(new AppError(errors, 400));
  }
  const reviewData = await Review.create({
    ratting: rate,
    review,
    user: req.user._id,
    book: bookId,
  });
  res.status(201).json({ status: httpStatusText.SUCCESS, review: reviewData });
});
