const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    require: [true, "Order must have a book"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: [true, "Order must belong to a user"],
  },
  price: {
    type: Number,
    require: [true, "Order must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "profile_img first_name last_name" });
  this.populate({ path: "book", select: "title thumbnail quantity price" });
  next();
});
const Order = mongoose.model("Order", orderSchema, "Order");
module.exports = Order;
