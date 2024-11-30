const AppError = require('../utils/appError');

const handleJsonWebTokenError = () => {
  return new AppError('Invalid token!', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Token has been expried!', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') {
      err = handleJsonWebTokenError();
    }

    if (err.name === 'TokenExpiredError') {
      err = handleTokenExpiredError();
    }

    sendErrorProd(err, res);
  }
};
