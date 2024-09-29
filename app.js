const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const limitRate = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const compression = require("compression");
// utils
const httpStatusText = require("./utils/httpStatusText");
const AppError = require("./utils/appError");
// Utility for deleting inactive users
const deleteInactiveUsers = require("./utils/deleteUnactiveUsers");

// routes
const bookRoute = require("./Routes/book-route");
const authRoute = require("./Routes/auth-route");
const userRoute = require("./Routes/user-route");
const adminRoute = require("./Routes/admin-route");
const favoriteRoute = require("./Routes/favorite-route");
const genreRoute = require("./Routes/genre-route");
const reviewRoute = require("./Routes/review-route");
const paymentRoute = require("./Routes/payment-route");
const orderRoute = require("./Routes/order-route");

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
// controller
const GlobalErrorHandler = require("./Controller/error-controller");

// set security HTTP headers
app.use(helmet());
// body parser, reading data from body into req.body limit body for 10 kb
app.use(express.json({ limit: "10kb" }));
//Data sanitization aganist noSql injection
app.use(mongoSanitize());
//Data sanitization aganist xss
app.use(xss());
//prevent parmeter pllutuion
// app.use(hpp({ whitelist: [] }));
app.use(hpp());
// cors
app.use(cors());
//corn

// compression for text and json
app.use(compression());
// limit request from same api
const limiter = limitRate({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/api", limiter);
// Routes
app.use("/api/book", bookRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/favorite", favoriteRoute);
app.use("/api/genre", genreRoute);
app.use("/api/review", reviewRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/order", orderRoute);

// error route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// unactive user will delete after 10 days
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled job to delete inactive users");
  deleteInactiveUsers();
});
// handle error middleware
app.use(GlobalErrorHandler);
module.exports = app;
