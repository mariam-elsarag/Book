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

  // Validate quantity
  if (!quantity || quantity <= 0) {
    return next(new AppError("Quantity must be a positive integer", 400));
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError("Book not found", 404));
  }
  if (book.quantity < quantity) {
    return next(new AppError("Insufficient quantity available", 400));
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: book.title,
            description: book.description,
            // images: [`${req.protocol}://${req.get("host")}${book.thumbnail}`],
          },
          unit_amount: Math.round(book.price * 100),
        },
        quantity: quantity,
      },
    ],
    customer_email: req.user.email,
    client_reference_id: bookId,
    mode: "payment",
    success_url: `${process.env.FRONT_SERVER}/success-payment/?book=${bookId}&price=${book.price}&quantity=${quantity}`,
    cancel_url: `${process.env.FRONT_SERVER}/cancel-payment`,
  });

  // Respond with session ID and URL
  res.status(200).json({ session_id: session.id, url: session.url });
});

exports.successPayment = CatchAsync(async (req, res, next) => {
  const { book, quantity } = req.body;
  if (!book && !req.user && !quantity)
    return next(new AppError("Book and price are required", 400));
  const bookData = await Book.findById(book);
  if (!bookData) {
    return next(new AppError("Book not found", 404));
  }
  if (bookData.quantity < quantity) {
    return next(new AppError("Insufficient quantity available", 400));
  }
  bookData.quantity -= quantity;
  await bookData.save();
  await Order.create({
    book,
    price: bookData.price * quantity,
    user: req.user._id,
  });
  res.status(201).json({
    message: "Order created successfully",
  });
});
