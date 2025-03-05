// DB
require("dotenv").config();
const connectDB = require("./db/connect");
// Express
const express = require("express");
const app = express();
require("express-async-errors");
// error Handlers
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
// routes
const productsRouter = require("./routes/products");

app.use(express.json());

// routes
app.use("/api/v1/products", productsRouter);

// error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port : ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
