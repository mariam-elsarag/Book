class Pagination {
  constructor(page = 1, limit = 10, query) {
    this.page = parseInt(page, 10);
    this.limit = parseInt(limit, 10);
    this.query = query;
    this.skip = (this.page - 1) * this.limit;
  }
  async getPagination(model) {
    const paginatedQuery = this.query.skip(this.skip).limit(this.limit);
    const [data, count] = await Promise.all([
      paginatedQuery.exec(),
      model.countDocuments(this.query.getQuery()),
    ]);
    const totalPages = Math.ceil(count / this.limit);
    return {
      hasNextPage: this.currentPage < totalPages,
      hasPrevPage: this.currentPage > 1,
      currentPage: this.currentPage,
      totalPages,
      count,
      results: data,
    };
  }
}
module.exports = Pagination;
