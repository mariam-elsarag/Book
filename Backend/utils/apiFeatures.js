class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const querObj = [...this.queryString];
    const excludedFields = ["page", "limit", "fields", "sort"];
    excludedFields.forEach((item) => delete querObj[item]);
    // for advance filter
    let queryStr = JSON.stringify(querObj);
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
    const limit = 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = apiFeatures;
