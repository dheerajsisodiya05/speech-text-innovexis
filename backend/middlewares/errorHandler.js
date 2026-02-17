const errorHandler = (err, req, res, next) => {
  console.error('[ERROR HANDLER] Error caught:', err.message);
  console.error('[ERROR HANDLER] Stack trace:', err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
