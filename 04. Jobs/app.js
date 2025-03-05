require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require("express");
const app = express();
const authenticatedUser = require("./middleware/authentication");

// connect db
const connectDB = require("./db/connect");

// routes
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(express.json());
// extra packages
app.set("trust proxy", 1); // if we deploy reverse proxy (heroku, netlify and etc)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes, when api reaches limit, it will be accessable after 15 minutes
    // max: 100,  limit each IP to 100 request per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// middlewares routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", [authenticatedUser, jobsRouter]);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
