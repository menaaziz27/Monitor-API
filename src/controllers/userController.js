const { asyncHandler } = require('../middlewares/asyncHandler');
const User = require('../models/User');

exports.getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.findAll();
	res.json(users);
});
