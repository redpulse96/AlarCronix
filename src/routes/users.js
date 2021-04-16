'use strict';

// Importing packages
const { Router } = require('express');
const router = Router();

// Importing Middlewares
const { protect, validateRequest } = require('../middlewares');

// Importing handlers
const { getSingleUser, login, logout, signup, update } = require('../handlers');

router.post('/login', validateRequest, login);
router.post('/register', validateRequest, signup);
router.post('/logout', logout);
router.post('/update', protect, update);
router.get('/fetch', protect, getSingleUser);

module.exports = router;
