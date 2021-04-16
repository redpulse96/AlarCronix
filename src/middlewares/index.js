module.exports = {
  ...require('./protect'),
  errorHandler: require('./errorHandler'),
  validateRequest: require('./validator'),
};
