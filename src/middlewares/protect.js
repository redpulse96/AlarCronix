'use strict';

// Import packages
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// Import modules
const { AppError, catchAsync } = require('../utils');
const { UsersModel } = require('../models');

const protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if there's a token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError('Please log in', 401));

  // Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user available
  const user = await UsersModel.findById(decoded._id);
  if (!user) {
    return next(new AppError('User belongs to this token is not available', 401));
  }

  // Grant access
  req.user = user.toJSON();
  next();
});

module.exports = { protect };
