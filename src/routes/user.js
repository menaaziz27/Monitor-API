const express = require('express');
const { getUsers } = require('../controllers/userController');
const router = express.Router();
const { isAuth } = require('../middlewares/isAuth');

router.route('/').get(isAuth, getUsers);

module.exports = router;
