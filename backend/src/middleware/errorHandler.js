const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { notFound, errorHandler };