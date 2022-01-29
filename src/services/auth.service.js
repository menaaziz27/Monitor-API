const res = require('express/lib/response');
const { asyncHandler } = require('../middlewares/asyncHandler');
const User = require('../models/User');
const userService = require('./user.service');
const jwtService = require('./jwt.service');
const { ApiError } = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

exports.register = asyncHandler(async body => {
	const { email } = body;

	const existingUser = await User.isEmailTaken(email);

	if (existingUser && existingUser.confirmed) {
		throw new ApiError('This email already exists', 422);
	}

	const user = await User.create(body);

	const payload = { _id: user._id };
	const token = jwtService.generateAccessToken(payload);

	console.log(token);

	let url = `http://localhost:4000/v1/api/auth/confirm/${token}`;

	let emailOptions = {
		to: user.email,
		subject: 'Account verification.',
		html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
	};
	sendEmail(emailOptions);

	return user;
});

exports.login = asyncHandler(async body => {
	const { email, password } = body;

	const user = await userService.getUser({ email });

	if (!user) {
		throw new ApiError('this user is not exists', 404);
	}

	console.log(user);
	if (!user.confirmed) {
		throw new ApiError('Your email is not verified.', 400);
	}

	const isMatched = await user.comparePasswords(password, user.password);

	if (!isMatched) {
		throw new ApiError('The password is incorrect.', 400);
	}

	const payload = { _id: user._id, email };
	const token = jwtService.generateAccessToken(payload);

	return token;
});

exports.confirm = asyncHandler(async token => {
	const user = jwtService.verifyToken(token);

	const updatedUser = await User.findByIdAndUpdate(user._id, { confirmed: true }, { new: true });

	return updatedUser;
});

exports.verify = asyncHandler(async body => {
	const { email } = body;

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError('this user is not exists', 404);
	}

	const payload = { _id: user._id };
	const token = jwtService.generateAccessToken(payload);

	let url = `http://localhost:4000/v1/api/auth/confirm/${token}`;

	let emailOptions = {
		to: user.email,
		subject: 'Account verification.',
		html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
	};
	await sendEmail(emailOptions);
	return;
});
