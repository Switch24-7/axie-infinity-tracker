const ApiError = require('./ApiError');

// eslint-disable-next-line no-unused-vars
function apiErrorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message);
  } return res.status(500).json('Internal server error');
}

module.exports = apiErrorHandler;
