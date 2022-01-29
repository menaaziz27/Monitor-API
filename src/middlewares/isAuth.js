const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { ApiError } = require('../utils/ApiError.js');
const { asyncHandler } = require('./asyncHandler.js');

exports.isAuth = asyncHandler(async (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);

			let user = await User.findById(decoded._id);
			req.user = user;

			next();
		} catch (e) {
			console.log(e.message);
			res.status(401);
			throw new ApiError('Invalid token.', 400);
		}
	} else {
		res.status(401);
		throw new ApiError('Not authorized.', 401);
	}
});
