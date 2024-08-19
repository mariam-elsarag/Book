// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

exports.getUsers = CatchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User.find(), req.query).paginate();
  const users = await features.query.select("-__v");
  const paginationData = await features.getPaginationData(User);
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
    req.path
  }`;
  res.status(200).json({
    next: paginationData.hasNextPage
      ? `${baseUrl}?page=${paginationData.currentPage + 1}`
      : null,
    prev: paginationData.hasPrevPage
      ? `${baseUrl}?page=${paginationData.currentPage - 1}`
      : null,
    count: paginationData.totalRecords,
    totalPages: paginationData.totalPages,
    results: users,
  });
});
