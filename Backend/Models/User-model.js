const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userScema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required"],
    maxlength: [20, "Max length for first name is 20 characters"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
    maxlength: [20, "Max length for last name is 20 characters"],
  },
  profile_img: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    required: [true, "Role is required"],
    enum: {
      values: ["admin", "user"],
      message: "Role is either admin or user",
    },
  },
  email: {
    type: String,
    require: [true, "Email is require"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Min length for password is 8 characters"],
    select: false,
  },
});
// encrypt password
userScema.pre("save", async function (next) {
  // check if password is modified
  if (!this.isModified("password")) return next();
  // encrypt password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model("user", userScema, "users");
module.exports = User;
