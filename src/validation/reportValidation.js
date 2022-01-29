const Joi = require('joi');

exports.reportValidation = Joi.object({
	status: Joi.string().valid('up', 'down').required(),
	availability: Joi.number().required(),
	outages: Joi.number().required(),
	downtime: Joi.number().required(),
	uptime: Joi.number().required(),
	responseTime: Joi.number().required(),
	history: Joi.string().required(),
});
