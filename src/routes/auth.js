const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	userRegister,
	userLogin,
	confirmEmail,
	verifyEmail,
} = require('../controllers/authController');
const { validateRequest } = require('../middlewares/validateRequest');
const { registerSchema, loginSchema, verifyEmailSchema } = require('../validation/authValidation');

router.route('/register').post(validateRequest(registerSchema), userRegister);
router.route('/login').post(validateRequest(loginSchema), userLogin);
router.route('/confirm/:token').get(confirmEmail);
router.route('/verify').post(validateRequest(verifyEmailSchema), verifyEmail);

module.exports = router;
