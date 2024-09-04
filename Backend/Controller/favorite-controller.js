const Favorite = require("../Models/Favorite-model");
const Book = require("../Models/Book-model");

const AppError = require("../utils/appError");
const CatchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");

exports.ToggleFavorite = CatchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  const isAlreadyFavorite = await Favorite.findOne({
    user: userId,
    book: bookId,
  });
  let isFavorite = false;

  if (isAlreadyFavorite) {
    await Favorite.findOneAndDelete({
      user: userId,
      book: bookId,
    });
  } else {
    await Favorite.create({ user: userId, book: bookId });
    isFavorite = true;
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, isFavorite });
});
