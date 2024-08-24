const { promisify } = require("node:util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const sendEmail = require("../utils/sendEmail");

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
const createAndSendToken = (user, statusCode, res) => {
  const token = generateToken(user);
  res.status(statusCode).json({
    status: httpStatusText.SUCCESS,
    token,
    user: user.noPassword(),
  });
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
  createAndSendToken(user, 201, res);
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

  createAndSendToken(user, 200, res);
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
exports.checkUserId = CatchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.id !== id) {
    return next(
      new AppError("You are not authorized to perform this action", 401)
    );
  }
  return next();
});

// forget password
exports.forgetPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("There's no user with this email address.", 404));
  }

  // Generate the reset token
  const resetToken = user.CreateResetToken();
  await user.save({ validateBeforeSave: false });

  // Create the reset URL
  const resetURL = `${process.env.FRONT_SERVER}/forget-password/${resetToken}`;

  // Construct the email message
  const html = `
  <h2>Forget your password?</h2>
  <p>
    Click on the following link to reset your password: <a href="${resetURL}">Reset Password</a>.
  </p>
  <p>If you didn't forget your password, please ignore this email.</p>
`;

  try {
    // Send the email
    await sendEmail({
      email,
      subject: "Password Reset",
      html,
    });
  } catch (err) {
    console.log(err, "err");
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error while sending the email. Try again later.",
        500
      )
    );
  }
  return res.status(200).json({
    status: "Success",
    message: "Token sent to email",
    resetToken: resetToken,
  });
});
// reset password
exports.resetPassword = CatchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  // hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // verify token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token in invalid or has expired", 400));
  }
  if (!password) {
    return next(new AppError("Password is require", 400));
  }
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  user.password = password;
  await user.save();
  const newToken = generateToken(user);
  res.status(200).json({ status: httpStatusText.SUCCESS, token: newToken });
});
// change password
exports.updatePassword = CatchAsync(async (req, res, next) => {
  const { current_passwrord, new_password } = req.body;
  if (!current_passwrord) {
    return next(new AppError("current_passwrord is required", 400));
  }
  if (!new_password) {
    return next(new AppError("new_password is required", 400));
  }

  const user = await User.findById(req.user.id).select("password");

  const checkPassword = await user.checkPassword(
    current_passwrord,
    user.password
  );
  if (!checkPassword) {
    return next(new AppError("Your current password is wrong", 400));
  }
  user.password = new_password;
  await user.save();
  const newToken = generateToken(user);
  res.status(200).json({ status: httpStatusText.SUCCESS, token: newToken });
});
