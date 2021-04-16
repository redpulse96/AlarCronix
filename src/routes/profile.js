'use strict';

// Importing packages
const { Router } = require('express');
const router = Router();

// Importing Middlewares
const { protect } = require('../middlewares');

// Importing handlers
const { createHandler, deleteHandler, readHandler, updateHandler } = require('../handlers');

router.post('/', protect, createHandler);
router.get('/', readHandler);
router.put('/', protect, updateHandler);
router.get('/:_id', readHandler);
router.delete('/', protect, deleteHandler);

module.exports = router;
