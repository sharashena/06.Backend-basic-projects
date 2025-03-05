const { StatusCodes } = require("http-status-codes");
// const { CustomAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };
  // duplicate email error with simple string
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value enter for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  // validation error simple string
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  // cast error (not found) simple string
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
