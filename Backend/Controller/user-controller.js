// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const filterBodyFields = require("../utils/filterBodyFields");

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
exports.getUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ status: httpStatusText.users, user });
});
// delete user
exports.deleteUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(204).json({ status: httpStatusText.users });
});
exports.updateUser = CatchAsync(async (req, res, next) => {
  const filteredBody = filterBodyFields(
    req.body,
    "first_name",
    "last_name",
    "email"
  );

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("-__v -passwordChangedAt");
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    user,
  });
});
// create users
exports.createUsers = CatchAsync(async (req, res, next) => {
  const filterBody = filterBodyFields(
    req.body,
    "first_name",
    "last_name",
    "email",
    "password",
    "role"
  );
  let errors = [];
  if (!filterBody.first_name)
    errors.push({ first_name: "First name is required" });
  if (!filterBody.last_name)
    errors.push({ last_name: "Last name is required" });
  if (!filterBody.email) errors.push({ email: "Email is required" });
  if (!filterBody.password) errors.push({ password: "Password is required" });

  if (errors.length > 0) {
    return next(new AppError(errors, 400));
  }
  const user = await User.create(filterBody);
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    user: user.noPassword(),
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
