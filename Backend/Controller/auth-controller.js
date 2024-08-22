const { promisify } = require("node:util");
const jwt = require("jsonwebtoken");
// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const verifyToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

exports.register = CatchAsync(async (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;
  const errors = [];

  if (!first_name) errors.push({ first_name: "First name is required" });
  if (!last_name) errors.push({ last_name: "Last name is required" });
  if (!email) errors.push({ email: "Email is required" });
  if (!password) errors.push({ password: "Password is required" });

  if (errors.length > 0) {
    return next(new AppError(errors, 400));
  }

  if (role === "admin") {
    const token = extractToken(req);
    if (!token)
      return next(new AppError("Unauthorized: Access is denied", 401));

    const decoded = await verifyToken(token);
    if (!decoded)
      return next(new AppError("Unauthorized: Access is denied", 401));

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("User no longer exists", 404));
    if (user.checkChangePasswordAfterJWT(decoded.iat)) {
      return next(new AppError("User recently changed password", 404));
    }

    if (decoded.role !== "admin") {
      return next(
        new AppError(
          "Access denied: You do not have permission to perform this action",
          403
        )
      );
    }
  }

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    role,
  });
  res.status(201).json({ status: httpStatusText.SUCCESS, user });
});

exports.login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push({ email: "Please enter an email" });
  if (!password) errors.push({ password: "Please enter a password" });

  if (errors.length > 0) {
    return next(new AppError(errors, 400));
  }

  const user = await User.findOne({ email }).select("+password -__v");
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Email or password is incorrect", 401));
  }

  const token = generateToken(user);
  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, token, user: user.toJson() });
});

exports.protect = CatchAsync(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next(new AppError("Unauthorized: Access is denied", 401));

  const decoded = await verifyToken(token);
  if (!decoded)
    return next(new AppError("Unauthorized: Access is denied", 401));

  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("User no longer exists", 404));
  if (user.checkChangePasswordAfterJWT(decoded.iat)) {
    return next(new AppError("User recently changed password", 404));
  }

  req.user = user;
  next();
});
// authrization
exports.restrectTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Access denied: You do not have permission to perform this action",
          403
        )
      );
    }
    return next();
  };
};

// to check if this same user
exports.checkUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.user.id, "id");
  console.log(id, "id from param");
  if (req.user.id !== id) {
    return next(
      new AppError("You are not authorized to perform this action", 401)
    );
  }
  return next();
});
