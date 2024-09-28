// model
const Review = require("../Models/Review-model");
const Order = require("../Models/Order-model");
// utils
const httpStatusText = require("../utils/httpStatusText");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Pagination = require("../utils/Pagination");
// controller
const Factory = require("./handle-factory");
// all reviews
exports.allReviews = catchAsync(async (req, res, next) => {
  const { id } = req.params; //book id
  const features = new Pagination(1, 10, Review.find({ book: id }));
  const reviews = await features.getPagination(Review);

  res.status(200).json({ status: httpStatusText.status, ...reviews });
});

// create review
exports.createReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
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
  const order = await Order.findOne({ book: id, user: req.user._id });
  if (!order) {
    return next(new AppError("You're not allowed to review this book", 403));
  }
  const havePreviousReview = await Review.findOne({
    book: id,
    user: req.user._id,
  });

  if (havePreviousReview) {
    return next(new AppError("You already reviewed this book", 403));
  }
  const reviewData = await Review.create({
    rating: rate,
    review,
    user: req.user._id,
    book: id,
  });
  res.status(201).json({ review: reviewData });
});
// delete review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const userReview = await Review.findOneAndDelete({ user: userId, _id: id });
  if (!userReview) {
    return next(
      new AppError("You are not authorized to delete this review.", 401)
    );
  }
  await Review.calcAverageRating(userReview.book);
  res.status(204).json({ data: null });
});
