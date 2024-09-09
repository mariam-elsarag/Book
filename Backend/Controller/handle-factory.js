// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterBodyFields = require("../utils/filterBodyFields");

exports.deleteOne = (Model) => {
  return CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Not found", 404));
    }

    res.status(204).json({ data: null });
  });
};
exports.getOne = (Model, excludeFields = [], populateOption) =>
  CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    // Populate if option is provided
    if (populateOption) {
      query = query.populate(populateOption);
    }

    if (excludeFields.length > 0) {
      const excludeFieldsString = excludeFields
        .map((field) => `-${field}`)
        .join(" ");
      query = query.select(excludeFieldsString);
    }

    // Always exclude "__v" field
    const doc = await query.select("-__v");
    if (!doc) {
      return next(new AppError("Not found", 404));
    }

    res.status(200).json({ data: doc });
  });

exports.getData = (Model, populateOption) =>
  CatchAsync(async (req, res, next) => {
    let query = Model.find();
    if (populateOption) {
      query = query.populate(populateOption);
    }
    const doc = await query.select("-__v");
    if (!doc) {
      return next(new AppError("Not found", 404));
    }
    res.status(200).json({ data: doc });
  });
exports.createOne = (Model, filterData) =>
  CatchAsync(async (req, res, next) => {
    const filterBody = filterBodyFields(req.body, filterData);
    let errors = {};

    filterData.forEach((el) => {
      if (!filterBody.hasOwnProperty(el) || !filterBody[el]) {
        errors[el] = `${el} is required`;
      }
    });
    if (Object.keys(errors).length > 0) {
      return next(new AppError(errors, 400));
    }
    const doc = await Model.create({ ...filterBody });

    res.status(201).json({ data: doc });
  });
