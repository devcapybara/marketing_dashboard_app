function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);
  console.error('Error stack:', err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = { message, statusCode: 400 };
  }

  if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError' ||
    (err.message && /jwt/i.test(err.message)) ||
    (err.message && err.message.includes('JWT_SECRET'))
  ) {
    error = { message: 'Autentikasi gagal', statusCode: 401 };
  }

  const isDev = process.env.NODE_ENV === 'development';
  const includeDebug =
    isDev &&
    !(err && err.message && (err.message.includes('JWT_SECRET') || /jwt/i.test(err.message)));

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(includeDebug && {
      stack: err.stack,
      error: err.message,
    }),
  });
}

module.exports = errorHandler;

