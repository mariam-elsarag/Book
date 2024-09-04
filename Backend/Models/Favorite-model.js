const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "Favorite must belong to a user"],
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    required: [true, "Favorite must be for a book"],
  },
});

favoriteSchema.pre(/^find/, function (next) {
  this.populate({
    path: "book",
    select: "-__v",
  });
  next();
});
const Favorite = mongoose.model("Favorite", favoriteSchema, "Favorites");
module.exports = Favorite;
