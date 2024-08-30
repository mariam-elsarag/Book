const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userScema = new mongoose.Schema(
  {
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
      default: "",
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
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    deActiveTime: {
      type: Date,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userScema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// encrypt password
userScema.pre("save", async function (next) {
  // check if password is modified
  if (!this.isModified("password")) return next();
  // encrypt password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
// change password at after rest password
userScema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// filter user that have isActive false
userScema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});
//check password
userScema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// to remove password
userScema.methods.noPassword = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.deActiveTime;
  delete userObject.isActive;
  return userObject;
};
// check if user change password after jwt issue
userScema.methods.checkChangePasswordAfterJWT = function (jwtTimeStemp) {
  if (this.passwordChangedAt) {
    const passwordChangeInMillis = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimeStemp < passwordChangeInMillis;
  }

  return false;
};
//reset token
userScema.methods.CreateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return resetToken;
};

const User = mongoose.model("user", userScema, "users");
module.exports = User;
