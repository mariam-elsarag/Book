const express = require("express");
const cors = require("cors");

// utils
const httpStatusText = require("./utils/httpStatusText");
const AppError = require("./utils/appError");
// routes
const bookRoute = require("./Routes/book-route");
const app = express();

// body
app.use(express.json());
// cors
app.use(cors());

// Routes
app.use("/api/book", bookRoute);

// error route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// handle error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || httpStatusText.FAIL;
  res.status(err.statusCode).json({ status: err.status, message: err.message });
  next();
});
module.exports = app;
