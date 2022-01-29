const { randomBytes } = require('crypto');

exports.createRandomString = async () => {
	return await randomBytes(20).toString('hex').substring(0, 6);
};
