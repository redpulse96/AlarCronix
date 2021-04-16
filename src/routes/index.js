const { Router } = require('express');
const router = Router();

const usersRouter = require('./users');
const profileRouter = require('./profile');

router.use('/user', usersRouter);
router.use('/profile', profileRouter);

module.exports = router;
