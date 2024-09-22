const Order = require("../Models/Order-model");
const Book = require("../Models/Book-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// packages
const stripe = require("stripe")(process.env.STRIP_SECRET_KEY);
exports.getCheckoutSession = CatchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { quantity } = req.body;
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError("Book not found", 404));
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: book.title,
          },
          unit_amount: book.price * 100,
        },
        quantity: quantity,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONT_SERVER}/success-payment?session_id={CHECKOUT_SESSION_ID}`, // Include session ID in URL
    cancel_url: `${process.env.FRONT_SERVER}/cancel-payment`,
  });
  res.status(200).json({ session_id: session.id, url: session.url });
});
