class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(fields = []) {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "fields", "sort"];
    excludedFields.forEach((item) => delete queryObj[item]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const combinedFilters = [];

    if (
      this.queryString.keywords &&
      this.queryString.keywords.trim() !== "" &&
      fields.length > 0
    ) {
      const keywordRegex = new RegExp(this.queryString.keywords, "i");

      const keywordSearchConditions = fields.map((field) => ({
        [field]: { $regex: keywordRegex },
      }));

      this.query = this.query.find({ $or: keywordSearchConditions });
    } else {
      if (Object.keys(queryObj).length > 0) {
        combinedFilters.push(JSON.parse(queryStr));
      }
    }

    if (combinedFilters.length > 0) {
      this.query = this.query.find({ $and: combinedFilters });
    } else {
      this.query = this.query.find({});
    }

    return this;
  }

  limitFields(selectItems) {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else if (selectItems) {
      this.query = this.query.select(selectItems);
    } else {
      this.query = this.query.select("title price author published_year");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.currentPage = page;
    this.pageSize = limit;

    return this;
  }

  async getPaginationData(model) {
    const count = await model.countDocuments();
    const totalPages = Math.ceil(count / this.pageSize);

    return {
      currentPage: this.currentPage,
      totalPages,
      totalRecords: count,
      hasNextPage: this.currentPage < totalPages,
      hasPrevPage: this.currentPage > 1,
    };
  }
}

module.exports = ApiFeatures;
