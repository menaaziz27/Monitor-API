const express = require('express');
const { getReport } = require('../controllers/reportController');
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router({ mergeParams: true });

router.route('/:checkId').get(isAuth, getReport);

module.exports = router;
