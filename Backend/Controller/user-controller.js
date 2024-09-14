const multer = require("multer");
const sharp = require("sharp");
// model
const User = require("../Models/User-model");
// utils
const CatchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const filterBodyFields = require("../utils/filterBodyFields");
// controller
const factory = require("./handle-factory");

// multer

// middleware
// for disk storage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
// image will be save in buffer
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("please upload only image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImg = upload.single("profile_img");
exports.resizeUserImg = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // resize image
  sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
// controllers
exports.getUsers = CatchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User.find(), req.query).paginate();
  const users = await features.query.select("-__v");
  const paginationData = await features.getPaginationData(User);
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
    results: users,
  });
});
// get single user
exports.getUser = factory.getOne(User, [
  "resetPasswordExpire",
  "resetPasswordToken",
]);
// delete user
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = CatchAsync(async (req, res, next) => {
  let id = req.user?.role === "admin" ? req.params.id : req.user.id;
  let filteredBody;
  if (req.user?.role === "admin") {
    filteredBody = filterBodyFields(
      req.body,
      "first_name",
      "last_name",
      "email",
      "role"
    );
  } else {
    filteredBody = filterBodyFields(
      req.body,
      "first_name",
      "last_name",
      "email"
    );
  }
  if (req.file) {
    filteredBody.profile_img = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("User Not found", 404));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    user,
  });
});

exports.deActivateUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, {
    isActive: false,
    deActiveTime: Date.now(),
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Successfully deactivate account",
  });
});
