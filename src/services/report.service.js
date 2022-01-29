const { asyncHandler } = require('../middlewares/asyncHandler');
const Report = require('../models/Report');

exports.create = asyncHandler(async body => {
	return await Report.create(body);
});
