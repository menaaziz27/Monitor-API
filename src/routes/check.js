const express = require('express');
const {
	createCheck,
	editCheck,
	deleteCheck,
	getChecks,
	pauseCheck,
	getCheck,
} = require('../controllers/checkController');
const { isAuth } = require('../middlewares/isAuth');
const { validateRequest } = require('../middlewares/validateRequest');
const { checksValidation, editCheckValidation } = require('../validation/checksValidation');
const router = express.Router({ mergeParams: true });

router.route('/').get(getChecks).post(isAuth, validateRequest(checksValidation), createCheck);
router
	.route('/:id')
	.get(isAuth, getCheck)
	.put(isAuth, validateRequest(editCheckValidation), editCheck)
	.delete(isAuth, deleteCheck);

router.route('/:id/pause').put(isAuth, pauseCheck);

module.exports = router;
