const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const checkRoutes = require('./check');
const reportRoutes = require('./report');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/checks', checkRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
