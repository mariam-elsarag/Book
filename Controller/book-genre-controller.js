const Genre = require("../Models/book-genre-model");

// utils
const AppError = require("../utils/appError");
const CatchAsync = require("../utils/catchAsync");
// controller
const Factor = require("./handle-factory");
exports.getGenres = Factor.getData(Genre);
exports.createGenre = Factor.createOne(Genre, ["title"]);
exports.deleteGenre = Factor.deleteOne(Genre);
