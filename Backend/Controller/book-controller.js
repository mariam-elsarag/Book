const Book = require("../Models/Book-model");
const ApiFeatures = require("../utils/apiFeatures");
exports.getBooks = async (req, res) => {
  try {
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
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getBook = async (req, res) => {
  try {
    const feaures = new ApiFeatures(
      Book.findById(req.params.id),
      req.query
    ).limitFields();
    const book = await feaures.query;
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ book });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: err.message });
  }
};
exports.createBook = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
exports.updateBook = async (req, res) => {
  try {
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
      }),
      ""
    ).limitFields();
    const updatedBook = await features.query;
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ book: updatedBook });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(204).json({ data: "" });
  } catch (err) {
    console.log("delete error", err);
    res.status(500).json({ message: err.message });
  }
};
