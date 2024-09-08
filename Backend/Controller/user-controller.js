// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const filterBodyFields = require("../utils/filterBodyFields");
// controller
const factory = require("./handle-factory");
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
// get single user
exports.getUser = factory.getOne(User);
// delete user
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = CatchAsync(async (req, res, next) => {
  let filteredBody;
  if (req.user?.role === "admin") {
    filteredBody = filterBodyFields(
      req.body,
      "first_name",
      "last_name",
      "email",
      "role"
    );
  } else {
    filteredBody = filterBodyFields(
      req.body,
      "first_name",
      "last_name",
      "email"
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("-__v -passwordChangedAt");
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    user,
  });
});

exports.deActivateUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, {
    isActive: false,
    deActiveTime: Date.now(),
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Successfully deactivate account",
  });
});
