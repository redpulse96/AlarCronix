'use strict';

// Importing the model
const { ProfileModel } = require('../models');

// Importing utils
const { AppError, catchAsync } = require('../utils');

// Handler function to Create a profile
const createHandler = catchAsync(async (req, res, next) => {
  const {
    body: { role, summary },
    user: { _id, username },
  } = req;

  const existingProfile = await ProfileModel.findOne({ userId: _id });
  if (existingProfile) {
    const updateProfile = {
      userId: _id,
      username: username,
      role: role,
      summary: summary,
    };
    await ProfileModel.updateOne({ _id: existingProfile.toJSON()._id }, updateProfile);
    console.log('----------| updateProfile |----------');

    res.status(200).json({
      status: 'success',
      data: { ...updateProfile },
    });
  } else {
    const createProfile = new ProfileModel();
    createProfile.userId = _id;
    createProfile.username = username;
    createProfile.role = role;
    createProfile.summary = summary;
    await createProfile.save();
    console.log('----------| createProfile |----------');

    res.status(200).json({
      status: 'success',
      data: { ...createProfile.toJSON() },
    });
  }
});

const readHandler = catchAsync(async (req, res, next) => {
  const {
    params: { _id },
    query: { username },
  } = req;

  const $or = [{ _id }, { username }];
  const userProfile = await ProfileModel.findOne({ $or });
  if (!userProfile) return next(new AppError('User profile not created', 400));

  res.status(200).json({
    success: true,
    result: { ...userProfile.toJSON() },
  });
});

const updateHandler = catchAsync(async (req, res, next) => {
  const {
    body,
    user: { _id: userId },
  } = req;

  const userProfile = await ProfileModel.findOne({ userId });
  if (!userProfile) return next(new AppError('User profile does not exist', 400));

  console.log('----------| userProfile |----------');

  const { _id } = userProfile.toJSON();
  const updatedSummary = {
    summary: {
      ...userProfile.toJSON().summary,
      ...body,
    },
  };

  await ProfileModel.updateOne({ _id }, updatedSummary);

  res.status(200).json({
    success: true,
    result: { ...userProfile.toJSON() },
  });
});

const deleteHandler = catchAsync(async (req, res, next) => {
  const {
    user: { _id: userId },
  } = req;

  const deletedProfile = await ProfileModel.findOneAndDelete({ userId });
  if (!deletedProfile) return next(new AppError('User profile does not exist', 400));

  console.log('----------| deletedProfile |----------');

  res.status(200).json({
    success: true,
    result: { ...deletedProfile.toJSON() },
  });
});

module.exports = {
  createHandler,
  readHandler,
  updateHandler,
  deleteHandler,
};
