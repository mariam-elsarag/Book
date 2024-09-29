const httpStatusText = require("./httpStatusText");
class AppError extends Error {
  constructor(message, statusCode) {
    super();

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? httpStatusText.FAIL
      : httpStatusText.ERROR;
    this.isOperational = true;
    this.message = message;
    // for captureing error
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
