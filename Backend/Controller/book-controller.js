const Book = require("../Models/Book-model");
const Favorite = require("../Models/Favorite-model");

const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const CatchAsync = require("../utils/catchAsync");
const filterBodyFields = require("../utils/filterBodyFields");
// controller
const Factor = require("./handle-factory");
exports.getBooks = CatchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Book.find(), req.query)
    .filter()
    .limitFields("-__v")
    .paginate();

  const books = await features.query;
  let booksWithFavorites = books.map((book) => ({
    ...book.toObject(),
    isFavorite: false,
  }));

  if (req.user && req.user._id) {
    const favorites = await Favorite.find({ user: req.user._id }).select(
      "book"
    );
    const favoritesBookSet = new Set(
      favorites.map((fav) => fav.book?._id.toString())
    );

    booksWithFavorites = books.map((book) => ({
      ...book.toObject(),
      isFavorite: favoritesBookSet.has(book._id.toString()),
    }));
  }

  const paginationData = await features.getPaginationData(Book);

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
    req.path
  }`;

  res.status(200).json({
    next: paginationData.hasNextPage
      ? `${baseUrl}?page=${paginationData.currentPage + 1}`
      : null,
    prev: paginationData.hasPrevPage
      ? `${baseUrl}?page=${paginationData.currentPage - 1}`
      : null,
    count: paginationData.totalRecords,
    totalPages: paginationData.totalPages,
    results: booksWithFavorites,
  });
});

exports.getBook = CatchAsync(async (req, res, next) => {
  const feaures = new ApiFeatures(
    Book.findById(req.params.id),
    req.query
  ).limitFields("-__v");
  let book = await feaures.query.populate("reviews");
  if (!book) {
    return next(new AppError("Book not found", 404));
  }
  let isFavorite = false;
  if (req.user && req.user._id) {
    const favorite = await Favorite.findOne({
      book: req.params.id,
      user: req.user._id,
    });

    if (favorite) {
      isFavorite = favorite.book ? true : false;
    }
  }
  res.status(200).json({
    ...book.toObject(),
    isFavorite,
  });
});

exports.createBook = CatchAsync(async (req, res, next) => {
  const filterBody = filterBodyFields(
    req.body,
    "title",
    "author",
    "price",
    "published_year",
    "genre"
  );

  const listData = ["title", "author", "price", "published_year", "genre"];
  let errors = {};

  listData.forEach((el) => {
    if (!filterBody.hasOwnProperty(el) || !filterBody[el]) {
      errors[el] = `${el} is required`;
    }
  });

  if (Object.keys(errors).length > 0) {
    return next(new AppError(errors, 400));
  }
  const book = await Book.create({
    title: filterBody.title,
    author: filterBody.author,
    price: filterBody.price,
    published_year: filterBody.published_year,
    genre: filterBody.genre,
  });
  res.status(201).json({ data: book });
});

exports.updateBook = CatchAsync(async (req, res, next) => {
  const filterBody = filterBodyFields(
    req.body,
    "title",
    "author",
    "price",
    "published_year",
    "genre"
  );

  const features = new ApiFeatures(
    Book.findByIdAndUpdate(req.params.id, filterBody, {
      new: true,
      runValidators: true,
    }),
    ""
  ).limitFields();
  const updatedBook = await features.query;
  if (!updatedBook) {
    return next(new AppError("Book not found", 404));
  }

  res.status(200).json({ book: updatedBook });
});

exports.deleteBook = Factor.deleteOne(Book);
