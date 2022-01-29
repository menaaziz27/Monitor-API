const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema(
	{
		key: {
			type: String,
			required: true,
		},
		expression: {
			type: String,
			required: true,
		},
		runningCounter: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
