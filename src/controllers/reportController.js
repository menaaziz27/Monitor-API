const { asyncHandler } = require('../middlewares/asyncHandler');
const reportService = require('../services/report.service');
const Chart = require('chart.js');

exports.getReport = asyncHandler(async (req, res, next) => {
	const report = await reportService.create(req.params.checkId, req.body);
	res.render('report.ejs', { report });
});
