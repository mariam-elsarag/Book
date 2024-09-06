// utils
const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteOne = (Model) => {
  return CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Not found", 404));
    }

    res.status(204).json({ data: null });
  });
};
exports.getOne = (Model, populateOption) =>
  CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOption) {
      query = query.populate(populateOption);
    }
    const doc = await query.select("-__v");
    if (!doc) {
      return next(new AppError("Not found", 404));
    }
    res.status(200).json({ data: doc });
  });
