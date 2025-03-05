const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// import mongo DB
const connectDB = require("./db/connect");
// dontenv
require("dotenv").config();

// middlewares
app.use(express.static("./public"));
app.use(express.json());
app.use("/api/v1/tasks", tasks);

// errors
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port : ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
