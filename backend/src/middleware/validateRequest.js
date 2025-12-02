function validateRequest(validator) {
  return (req, res, next) => {
    const { error, value } = validator(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
}

module.exports = validateRequest;

