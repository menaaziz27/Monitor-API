// one to many relation with checks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
	{
		status: {
			type: String,
			enum: ['up', 'down'],
			required: true,
		},
		availability: {
			type: Number,
			required: true,
		},
		outages: {
			type: Number,
			required: true,
			default: 0,
		},
		downtime: {
			type: Number,
			required: true,
			default: 0,
		},
		uptime: {
			type: Number,
			required: true,
		},
		responseTime: {
			type: Number,
			required: true,
		},
		history: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
