const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({});

const Order = mongoose.model("Order", orderSchema, "Order");
module.exports = Order;
