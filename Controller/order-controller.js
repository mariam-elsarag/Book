const Order = require("../Models/Order-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Pagination = require("../utils/Pagination");
// controller
const Factory = require("./handle-factory");

exports.getOrders = CatchAsync(async (req, res, next) => {
  const isAdmin = req.user.role === "admin" ? true : false;
  let orders;
  if (isAdmin) {
    const features = new Pagination(1, 10, Order.find());
    orders = await features.getPagination(Order);
  } else {
    const features = new Pagination(1, 10, find({ user: req.user._id }));
    orders = await features.getPagination(Order);
  }
  res.status(200).json({ ...orders });
});

exports.getOrder = Factory.getOne(Order, (excludeFields = ["_v"]));
exports.deleteOrder = Factory.deleteOne(Order);
exports.updateOrder = Factory.updateOne(Order, "paid", "price");
