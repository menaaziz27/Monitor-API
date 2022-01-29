require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./utils/database');
const PORT = process.env.PORT || 4000;
const { init } = require('./cronjobs');

// run jobs in background
init();

connectDB()
	.then(client => {
		app.listen(PORT, () => {
			console.log(`Server in listening on port: ${PORT} 🚀`);
		});
		console.log(`MongoDB connected on ${client.connection.name}`);
	})
	.catch(err => {
		console.log(`db error ${err}`);
	});
