const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
// handle cast error
const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
// duplicate key
const handleDuplicateKeyDb = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const fieldWithSuffix = err.message.match(/index:\s([a-zA-Z0-9_]+)/)[1]; // Extracts field name with possible suffix
  const field = fieldWithSuffix.replace(/_1$/, "");

  const message = `Duplicate ${field} value: ${value}`;
  return new AppError(message, 400);
};
// validation error
const handleValidationErrorDb = (err) => {
  const errors = [];

  Object.values(err.errors).forEach((el) => {
    if (el.name === "CastError") {
      errors.push({
        [el.path]: `Invalid input for ${el.path}: ${el.value}. Expected a ${el.kind}.`,
      });
    } else {
      errors.push({
        [el.path]: el.message,
      });
    }
  });

  const message =
    errors.length > 0 ? errors : [{ error: "Invalid input data." }];

  return new AppError(message, 400);
};

// jwt
const handleJWTError = () => {
  return new AppError("Invalid token", 401);
};
const handleExpireJWTError = () => {
  return new AppError("Your token has expired!", 401);
};
const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorForPro = (err, res) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, errors: err.message });
  } else {
    // console.error(err, "Error 🚫");
    // generic message
    res
      .status(500)
      .json({ status: err.status, message: "Something went wrong" });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || httpStatusText.FAIL;

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    console.log(error, "name");
    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateKeyDb(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDb(error);
    if (
      error.name === "jsonWebTokenError" ||
      error.name === "invalid signature"
    ) {
      error = handleJWTError();
    }

    if (error.name === "TokenExpiredError") error = handleExpireJWTError();

    sendErrorForPro(error, res);
  }

  next();
};
