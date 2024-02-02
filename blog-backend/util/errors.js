const errorHandler = (err, _req, res, next) => {
  switch (err.message) {
    case 'invalid username or password':
    case 'token missing':
    case 'token invalid':
    case 'invalid signature':
      res.status(401);
      err.message = "Unauthorized"
      break
    default:
      res.status(404);
  }
  res.json({
    error: err.errors ? err.errors.map(
      e => e.name !== undefined
        ? `${e.name}: ${e.message}`
        : e.message) : err.message
  });

  next(err);
};

module.exports = errorHandler