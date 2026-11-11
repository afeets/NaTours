const keys = require('../config/dev');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid {err.path}: ${err.value}.`;
  // return message with bad request error code
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.values).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // log error
    console.error('ERROR', err);

    // return generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (keys.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (keys.NODE_ENV === 'production') {
    let error = { ...err };
    // handle invalid query
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // handle duplicates
    if (error.code === '11000') error = handleDuplicateFieldsDB(error);

    // validation errors
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
