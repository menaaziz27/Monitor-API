const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

userSchema.statics.isEmailTaken = async email => {
	return await User.findOne({ email });
};

userSchema.methods.comparePasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
	const user = this;
	const hashedPassword = await bcrypt.hash(user.password, 8);
	user.password = hashedPassword;
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
