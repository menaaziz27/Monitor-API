const jwt = require('jsonwebtoken');

let defaultOptions = {
	expiresIn: '1d',
};

exports.generateAccessToken = (payload, expireOption = defaultOptions) => {
	return jwt.sign(payload, process.env.TOKEN_SECRET, expireOption);
};
exports.verifyToken = token => {
	return jwt.verify(token, process.env.TOKEN_SECRET);
};
