'use strict';

class AppError extends Error {
  constructor(message, statusCode, error) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.error = error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    if (process.env.NODE_ENV == 'prod') {
      delete this['stack'];
    }
  }
}

module.exports = AppError;
