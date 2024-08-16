const Book = require("../Models/Book-model");
const ApiFeatures = require("../utils/apiFeatures");

const CatchAsync = require("../utils/catchAsync");

exports.getBooks = CatchAsync(async (req, res, next) => {
  // base url
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
    req.path
  }`;

  const page = +req.query.page || 1;
  const limit = 3;

  const count = await Book.countDocuments();
  const pages = Math.ceil(count / limit);
  const features = new ApiFeatures(Book.find(), req.query)
    .limitFields()
    .paginate();
  const book = await features.query;
  res.status(200).json({
    next: page < pages ? `${baseUrl}?page=${page + 1}` : null,
    prev: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
    count,
    results: book,
  });
});
exports.getBook = CatchAsync(async (req, res, next) => {
  const feaures = new ApiFeatures(
    Book.findById(req.params.id),
    req.query
  ).limitFields();
  const book = await feaures.query;
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json({ book });
});

exports.createBook = CatchAsync(async (req, res, next) => {
  const { title, author, price, published_year } = req.body;

  if (!title || !author || !price) {
    if (!title) {
      res.status(400).json({ message: "Title is required" });
    }
    if (!author) {
      res.status(400).json({ message: "Author is required" });
    }
    if (!price) {
      res.status(400).json({ message: "Price is required" });
    }
    if (!published_year) {
      res.status(400).json({ message: "Published year is required" });
    }
    return;
  } else {
    const book = await Book.create({
      title: title,
      author: author,
      price: price,
      published_year: published_year,
    });
    res.status(201).json({ data: book });
  }
});

exports.updateBook = CatchAsync(async (req, res, next) => {
  const updateData = {};
  const acceptableFields = ["title", "author", "price", "published_year"];
  acceptableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const features = new ApiFeatures(
    Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }),
    ""
  ).limitFields();
  const updatedBook = await features.query;
  if (!updatedBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json({ book: updatedBook });
});

exports.deleteBook = CatchAsync(async (req, res, next) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  if (!deletedBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(204).json({ data: "" });
});
