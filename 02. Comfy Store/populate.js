require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/products");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    // remove all products what we have in DB
    await Product.deleteMany();
    await Product.create(jsonProducts);
    // exit process
    process.exit(0);
} catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
