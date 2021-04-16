'use strict';

// Importing the packages
const jwt = require('jsonwebtoken');

// Importing the model
const { UsersModel } = require('../models');

// Importing utils
const { generateHash, generateSalt, validatePassword, AppError, catchAsync } = require('../utils');

// Handler function to register the user
const signup = catchAsync(async (req, res, next) => {
  const { email, password, username } = req.body;
  const $or = [{ username }, { email }];

  const merchantExists = await UsersModel.findOne({ $or });
  if (merchantExists) {
    console.log('----------| merchantExists |----------');
    const message = merchantExists.email == email ? 'Email' : 'Username';
    const invalidEmail = merchantExists.email == email ? true : false;
    const invalidUsername = merchantExists.email == email ? true : false;
    return next(
      new AppError(message + ' already registered', 400, { invalidEmail, invalidUsername }),
    );
  }
  const merchantDetails = new UsersModel();
  const salt = await generateSalt();
  const encryptedPassword = await generateHash(password, salt);
  merchantDetails.username = username;
  merchantDetails.email = email;
  merchantDetails.password = encryptedPassword;
  await merchantDetails.save();
  res.status(200).json({
    success: true,
    result: merchantDetails.toJSON(),
  });
});

// Handler function to login the user
const login = catchAsync(async (req, res, next) => {
  const { password, username, email } = req.body;
  const $or = [{ username }, { email }];

  const userExists = await UsersModel.findOne({ $or }).select('+password');
  if (!userExists) {
    return next(new AppError('Invalid email or password', 401));
  }

  const merchantDetails = userExists.toJSON();
  const { _id, password: encryptedPassword } = merchantDetails;
  const isPasswordValid = await validatePassword(password, encryptedPassword);
  if (isPasswordValid) {
    sendToken(_id, 201, res);
  } else {
    return next(new AppError('Invalid email or password', 401));
  }
});

const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', { expiresIn: 1000 });
  res.status(200).json({ status: 'success' });
});

const update = catchAsync(async (req, res, next) => {
  const {
    body,
    user,
    user: { _id },
  } = req;
  const updateObj = { ...body };
  delete updateObj['oldpassword'];
  delete updateObj['newpassword'];

  if (!user) return next(new AppError('User Not found!', 404));

  if (body.newpassword) {
    const isPasswordValid = await validatePassword(body.oldpassword, user.password);
    if (isPasswordValid) {
      const salt = await generateSalt();
      const encryptedPassword = await generateHash(body.newpassword, salt);
      updateObj.password = encryptedPassword;
    }
  }

  const update = await UsersModel.updateOne({ _id }, updateObj);
  if (!update.ok) return next(new AppError('No User updated!', 500));
  console.log('----------| update |----------');
  console.dir(update);

  res.status(200).json({
    status: 'success',
    data: { ...update },
  });
});

// Function to get user by id
const getSingleUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  if (!user) return next(new AppError('User Not found!', 402));

  res.status(200).json({
    status: 'success',
    data: { ...user },
  });
});

// Send token to client
function sendToken(_id, statusCode, res) {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV == 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    token,
    status: 'success',
  });
}

module.exports = {
  login,
  signup,
  getSingleUser,
  logout,
  update,
};
