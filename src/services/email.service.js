const nodemailer = require('nodemailer');
//! const sendGrid = require('nodemailer-sendgrid-transport');
const { ApiError } = require('../utils/ApiError');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
		clientId: process.env.OAUTH_CLIENTID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		refreshToken: process.env.OAUTH_REFRESH_TOKEN,
	},
});

exports.sendEmail = (options = { to, subject, html }) => {
	console.log({ options });
	transporter
		.sendMail({
			from: 'menaaziz27@gmail.com',
			to: options.to,
			subject: options.subject,
			text: 'text',
			html: options.html,
		})
		.then(res => console.log(res))
		.catch(err => {
			throw new ApiError('Error in sending email.', 422);
		});
};

module.exports = transporter;
