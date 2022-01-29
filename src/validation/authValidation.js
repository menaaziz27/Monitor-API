const Joi = require('joi');

exports.registerSchema = Joi.object({
	email: Joi.string().trim().min(1).email().required(),
	password: Joi.string().trim().min(6).required(),
});

exports.loginSchema = Joi.object({
	email: Joi.string().trim().min(1).email().required(),
	password: Joi.string().trim().min(6).required(),
});

exports.verifyEmailSchema = Joi.object({
	email: Joi.string().trim().min(1).email().required(),
});
