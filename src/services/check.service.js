const { asyncHandler } = require('../middlewares/asyncHandler');
const Check = require('../models/Check');
const { manager } = require('../cronjobs');
const { ApiError } = require('../utils/ApiError');

exports.fetchAll = asyncHandler(async _ => {
	return await Check.find({}).populate('job owner');
});

exports.create = asyncHandler(async (body, user) => {
	return await Check.create({ ...body, owner: user, method: body?.method?.toUpperCase() });
});

exports.update = asyncHandler(async (id, body, user) => {
	return await Check.findOneAndUpdate({ _id: id, owner: user }, body, { new: true });
});

exports.pause = asyncHandler(async id => {
	const check = await Check.findById(id);
	if (manager.exists(check?.job?.key)) {
		manager.stop(check.job.key);
	}
	check.shouldRun = false;
	return await check.save();
});

exports.delete = asyncHandler(async (id, user) => {
	const check = await this.getCheckById(id, user);

	if (!check) {
		throw new ApiError('No check is found.');
	}

	if (manager.exists(check?.job?.key)) {
		manager.deleteJob(check.job.key); // cancel the job from running in background
	}
	return await check.remove(); // to delete it's job as well
});

exports.getCheckById = asyncHandler(async (id, user) => {
	return await Check.findOne({ _id: id, owner: user }).populate('job');
});
