const AppError = require("../utils/appError");

// handle cast error
const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
// duplicate key
const handleDuplicateKeyDb = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Duplicate field value: ${value}`;
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

const httpStatusText = require("../utils/httpStatusText");
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
      .json({ status: err.status, message: err.message });
  } else {
    // console.error(err, "Error 🚫");
    // generic message
    res
      .status(500)
      .json({ status: err.status, message: "Something went wrong" });
    console.log(first);
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
    sendErrorForPro(error, res);
  }

  next();
};
