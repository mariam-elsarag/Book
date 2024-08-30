const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

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
const app = express();

// controller
const GlobalErrorHandler = require("./Controller/error-controller");

// body
app.use(express.json());
// cors
app.use(cors());
//corn

// Routes
app.use("/api/book", bookRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);

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
