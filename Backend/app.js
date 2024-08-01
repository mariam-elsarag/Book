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
  res.status(404).json({
    status: httpStatusText.FAIL,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});
module.exports = app;
