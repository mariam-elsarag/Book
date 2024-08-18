// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

exports.register = CatchAsync(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  let error = [];
  if (!first_name || !last_name || !email || !password) {
    if (!first_name) {
      error.push({ first_name: "First name is required" });
    }
    if (!last_name) {
      error.push({ last_name: "Last name is required" });
    }
    if (!email) {
      error.push({ email: "Email is required" });
    }
    if (!password) {
      error.push({ password: "Password is required" });
    }
    return next(new AppError(error, 400));
  } else {
    const user = await User.create({ first_name, last_name, email, password });
    res.status(201).json({ user });
  }
});
