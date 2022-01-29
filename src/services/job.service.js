const { asyncHandler } = require('../middlewares/asyncHandler');
const Job = require('../models/Job');
const { createRandomString } = require('../utils/helpers');

exports.create = asyncHandler(async check => {
	let jobExpression = `*/${check.interval} * * * * *`;
	let jobKey = await createRandomString();
	let job = await Job.create({ key: jobKey, expression: jobExpression });
	return job;
});
