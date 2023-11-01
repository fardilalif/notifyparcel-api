const Error = require('./custom-error.js');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;
