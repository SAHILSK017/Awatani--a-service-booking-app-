// Wraps async route handlers to catch errors automatically.
// Eliminates repetitive try/catch blocks in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
