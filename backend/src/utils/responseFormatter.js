function successResponse(data, message = 'Success', statusCode = 200) {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
}

function errorResponse(message = 'Error', statusCode = 400, errors = null) {
  const response = {
    success: false,
    message,
    statusCode,
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
}

module.exports = {
  successResponse,
  errorResponse,
};

