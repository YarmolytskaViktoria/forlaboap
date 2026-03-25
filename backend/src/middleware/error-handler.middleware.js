const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details || []
      }
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong"
    }
  });
};
module.exports = errorHandler;