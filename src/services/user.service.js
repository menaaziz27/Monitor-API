const { asyncHandler } = require('../middlewares/asyncHandler');
const User = require('../models/User');

exports.getUser = asyncHandler(async criteria => {
	const user = await User.findOne({ criteria });
	return user;
});
