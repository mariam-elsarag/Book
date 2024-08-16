class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "fields", "sort"];
    excludedFields.forEach((item) => delete queryObj[item]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
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
