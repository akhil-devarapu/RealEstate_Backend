const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Custom error responses
  switch (statusCode) {
    case 400:
      message = message || 'Bad Request';
      break;
    case 401:
      message = message || 'Unauthorized';
      break;
    case 403:
      message = message || 'Forbidden';
      break;
    case 404:
      message = message || 'Not Found';
      break;
    case 409:
      message = message || 'Conflict';
      break;
    case 413:
      message = message || 'Payload Too Large';
      break;
    case 429:
      message = message || 'Too Many Requests';
      break;
    case 500:
    default:
      message = message || 'Internal Server Error';
  }

  res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
