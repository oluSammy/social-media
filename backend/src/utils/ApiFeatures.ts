// import {  } from 'mongoose'

class ApiFeatures {
  query: any;
  queryString: Record<string, any>;

  constructor(query: any, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * method to filter based on a field in a document collection
   * filtering can be done with
   * lt => less than
   * gt => greater than
   * gte => greater than or equal
   * lte => less than or equal to
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    // remove excluded fields from copied queryObj
    excludedFields.forEach((field) => delete queryObj[field]);

    console.log(queryObj, "OBJ");
    let queryString = JSON.stringify(queryObj);
    console.log(queryString);
    // prefix gt, lt, lte, gte with $
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: any) => `$${match}`
    );

    console.log(JSON.parse(queryString));
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  /**
   * method to sort query results in ascending or descending order
   * results can be sorted byy any field
   * sort=age --sorts in ascending order
   * sort=-age -- sorts in descending order
   */
  sort() {
    if (this.queryString.sort) {
      const sortString = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortString);
    }

    return this;
  }

  /**
   * method to limit query results to specific fields
   * e.g fields=title,age
   * the result will only contain title and age for each document
   */
  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  /**
   * method to paginate query results
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 30;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;
