const express = require("express");
const cors = require("cors");

// utils
const httpStatusText = require("./utils/httpStatusText");
const AppError = require("./utils/appError");
// routes
const bookRoute = require("./Routes/book-route");
const authRoute = require("./Routes/auth-route");
const userRoute = require("./Routes/user-route");
const app = express();

// controller
const GlobalErrorHandler = require("./Controller/error-controller");

// body
app.use(express.json());
// cors
app.use(cors());

// Routes
app.use("/api/book", bookRoute);
app.use("/api/auth", authRoute);

// error route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// handle error middleware
app.use(GlobalErrorHandler);
module.exports = app;
