const mongoose = require('mongoose');
const Job = require('./Job');
const Schema = mongoose.Schema;
const { manager } = require('../cronjobs');

const checkSchema = new Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		report: {
			type: mongoose.Types.ObjectId,
			ref: 'Report',
		},
		job: {
			type: mongoose.Types.ObjectId,
			ref: 'Job',
		},
		shouldRun: {
			type: Boolean,
			default: true,
		},
		name: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		protocol: {
			type: String,
			enum: ['http', 'https', 'tcp'],
			required: true,
		},
		method: {
			type: String,
			enum: ['GET', 'POST', 'PUT', 'DELETE'],
			required: true,
		},
		state: {
			type: String,
			enum: ['up', 'down'],
		},
		expectedStatusCodes: {
			type: [Number],
			required: true,
		},
		lastCheckDate: {
			type: Date,
		},
		path: {
			type: String,
		},
		port: {
			type: Number,
		},
		webhook: {
			type: String,
		},
		timeout: {
			type: Number,
			default: 5,
		},
		interval: {
			type: Number,
			default: 5,
		},
		threshold: {
			type: Number,
			default: 1,
		},
		authentication: {
			type: String,
		},
		httpHeaders: [{ key: String, value: String }],
		assert: {
			type: Number,
		},
		tags: {
			type: [String],
		},
		ignoreSSL: {
			type: Boolean,
			required: true,
		},
		responseTime: {
			type: [Number],
		},
		uptimeCount: {
			type: Number,
			default: 0,
		},
		downtimeCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

checkSchema.pre('remove', async function (next) {
	// delete its job instance and stop their cronjob if it was running
	const check = this;
	await Job.findByIdAndDelete(check?.job?._id);
	if (check.job && check.shouldRun && manager.exists(check.job.key)) {
		manager.deleteJob(check.job.key);
	}
	next();
});

const Check = mongoose.model('Check', checkSchema);

module.exports = Check;
