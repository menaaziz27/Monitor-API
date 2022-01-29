const { asyncHandler } = require('../middlewares/asyncHandler');
const checkService = require('../services/check.service');
const { ApiError } = require('../utils/ApiError');

exports.getChecks = asyncHandler(async (req, res, next) => {
	const checks = await checkService.fetchAll();

	res.status(201).json(checks);
});

exports.getCheck = asyncHandler(async (req, res, next) => {
	const checks = await checkService.getCheckById(req.params.id, req.user);

	res.status(201).json(checks);
});

exports.createCheck = asyncHandler(async (req, res, next) => {
	const check = await checkService.create(req.body, req.user);

	res.status(201).json(check);
});

exports.editCheck = asyncHandler(async (req, res, next) => {
	const updatedCheck = await checkService.update(req.params.id, req.body, req.user);
	// update the job expression if the interval is changed
	if (!updatedCheck) {
		throw new ApiError('No check is found');
	}

	res.status(201).json(updatedCheck);
});

exports.pauseCheck = asyncHandler(async (req, res, next) => {
	await checkService.pause(req.params.id);

	res.status(200).json({ message: 'paused' });
});

exports.deleteCheck = asyncHandler(async (req, res, next) => {
	const deletedCheck = await checkService.delete(req.params.id, req.user);

	res.status(201).json(deletedCheck);
});
