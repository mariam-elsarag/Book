const express = require("express");
const cors = require("cors");

// utils
const httpStatusText = require("./utils/httpStatusText");
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
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = httpStatusText.FAIL;
  err.statusCode = 404;
  next(err);
});

// handle error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || httpStatusText.FAIL;
  res.status(err.statusCode).json({ status: err.status, message: err.message });
  next();
});
module.exports = app;
