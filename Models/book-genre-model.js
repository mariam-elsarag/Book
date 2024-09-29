const mongoose = require("mongoose");
const genereScema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "title is required"],
    maxlength: [100, "You exceed max length for title, 100 characters"],
  },
});

const Genre = mongoose.model("Genre", genereScema, "Genres");
module.exports = Genre;
