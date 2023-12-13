const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let error = {
    message: err.message || "Something went wrong, please try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name && err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(",");
    error.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name && err.name === "CastError") {
    error.message = `No item found with id: ${err.value}`;
    error.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    error.message = `Duplicate values entered for ${Object.keys(
      err.keyValue
    )}, please choose another value`;
    error.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(error.statusCode).json({ err, error: error.message });
};

module.exports = errorHandlerMiddleware;
