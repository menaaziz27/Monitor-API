const { asyncHandler } = require('../middlewares/asyncHandler');
const authService = require('../services/auth.service');

exports.userRegister = asyncHandler(async (req, res, next) => {
	const user = await authService.register(req.body);
	res.status(201).json(user);
});

exports.userLogin = asyncHandler(async (req, res, next) => {
	const token = await authService.login(req.body);
	res.status(200).json({ token });
});

exports.confirmEmail = asyncHandler(async (req, res, next) => {
	let updatedUser = await authService.confirm(req.params.token);
	res.status(200).json(updatedUser);
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
	await authService.verify(req.body);
	res.status(200).json({ message: 'email sent' });
});
