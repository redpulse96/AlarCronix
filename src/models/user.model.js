'use strict';

// Importing mongoose and Schema
const { Schema, model } = require('mongoose');
const validator = require('validator');

// Creating a schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'This is not a valid email',
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    registered_at: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: [null, 'employee', 'company', 'admin'],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual('profile', {
  ref: 'profile',
  localField: '_id',
  foreignField: 'userId',
});

// Creating model from a Schema
const UsersModel = model('user', userSchema);

module.exports = UsersModel;
