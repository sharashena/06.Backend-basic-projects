const Product = require("../models/products");

const getAllProductsStatic = async (req, res) => {
  // find products which featured are true
  // with multiple sort just enter space sort(name price)
  // $gt - greater than
  // $ls - less than
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("name")
    .select("name price")
    .limit(10)
    // skip first object
    .skip();
  res.status(200).json({ products, amount: products.length });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, priceFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // price filters
  if (priceFilters) {
    const operatorMap = {
      ">": "$gt",
      "<": "$lt",
      "=": "$eq",
      ">=": "$gte",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<=)\b/g;
    let filters = priceFilters.replace(
      regEx,
      match => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach(item => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  // fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ amount: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
