const jwt = require("jsonwebtoken");
// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE_IN,
    }
  );
  return token;
};
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
exports.login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  let error = [];
  if (!email || !password) {
    if (!email) {
      error.push({ email: "Please enter an email" });
    }
    if (!password) {
      error.push({ password: "Please enter a password" });
    }
    return next(new AppError(error, 400));
  }
  const user = await User.findOne({ email }).select("+password -__v");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("email or password are wrong", 401));
  }

  const token = generateToken(user);

  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, token, user: user.toJson() });
});
