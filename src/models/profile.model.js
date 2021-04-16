'use strict';

// Importing mongoose and Schema
const { Schema, model } = require('mongoose');

// Creating a schema
const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['employee', 'company', 'admin'],
      default: null,
    },
    summary: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Creating model from a Schema
const ProfileModel = model('profile', profileSchema);

module.exports = ProfileModel;
