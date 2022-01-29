const mongoose = require('mongoose');

exports.connectDB = async () => {
	try {
		return await mongoose.connect(process.env.MONGO_URI);
	} catch (e) {
		console.log(`Error: ${e.message}`);
	}
};
