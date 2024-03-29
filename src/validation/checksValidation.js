const Joi = require('joi');

exports.checksValidation = Joi.object({
	name: Joi.string().trim().min(1).required(),
	url: Joi.string().required(),
	protocol: Joi.string().valid('http', 'https', 'tcp').required(),
	method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE').uppercase().required(),
	statusCode: Joi.number().required(),
	path: Joi.string(),
	port: Joi.number(),
	webhook: Joi.string(),
	timeout: Joi.number(),
	interval: Joi.number().min(0).max(59),
	threshold: Joi.number(),
	authentication: Joi.string(),
	httpHeaders: Joi.array().items({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
	expectedStatusCodes: Joi.array().items(Joi.number()).required(),
	assert: Joi.number(),
	tags: Joi.array(),
	ignoreSSL: Joi.boolean().required(),
	job: Joi.object().optional(),
	shouldRun: Joi.boolean().optional(),
});

exports.editCheckValidation = Joi.object({
	name: Joi.string(),
	url: Joi.string(),
	protocol: Joi.string().valid('http', 'https', 'tcp'),
	expectedStatusCodes: Joi.array().items(Joi.number()),
	method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE').uppercase(),
	path: Joi.string(),
	port: Joi.number(),
	webhook: Joi.string(),
	timeout: Joi.number(),
	interval: Joi.number().min(0).max(59),
	threshold: Joi.number(),
	authentication: Joi.string(),
	httpHeaders: Joi.array().items({
		username: Joi.string(),
		password: Joi.string(),
	}),
	assert: Joi.number(),
	tags: Joi.array(),
	ignoreSSL: Joi.boolean(),
	job: Joi.object().optional(),
	shouldRun: Joi.boolean().optional(),
});
