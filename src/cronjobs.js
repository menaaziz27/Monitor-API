const CronJobManager = require('cron-job-manager');
const checkService = require('./services/check.service');
const emailService = require('./services/email.service');
const jobService = require('./services/job.service');
const axios = require('axios');
require('dotenv').config();

let manager = new CronJobManager();

axios.interceptors.request.use(
	function (config) {
		config.metadata = { startTime: new Date() };
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		response.config.metadata.endTime = new Date();
		response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
		return response;
	},
	function (error) {
		error.config.metadata.endTime = new Date();
		error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
		return Promise.reject(error);
	}
);

async function handleWebHookCalls(check) {
	try {
		let msg = `Your check: ${check.name} went down`;
		if (check?.webhook) {
			const res = await axios.post(check?.webhook, { msg });
			return res;
		}
	} catch (e) {
		console.log(`Error is sending HTTP request to check: ${check.name} webhook`);
		return err;
	}
}

function isStateChanged(check, checkState) {
	return check.state !== checkState ? true : false;
}

async function determineCheckState(check, checkResult) {
	return !checkResult.error && check?.expectedStatusCodes?.includes(checkResult.statusCode)
		? 'up'
		: 'down';
}

async function updateCheck(check, checkResult, checkState) {
	check.responseTime.push(checkResult?.responseTime);
	const emailOptions = {
		to: check.owner.email,
		subject: 'Check alert!',
		html: `Hello,
		Your check: ${check.name} is went down and does not behave as expected!`,
	};
	if (isStateChanged(check, checkState)) {
		if (checkState === 'up') {
			check.uptimeCount = check.uptimeCount + 1;

			emailService.sendMail(emailOptions);
		} else {
			// changed to down
			check.downtimeCount = check.downtimeCount + 1;

			await handleWebHookCalls(check);
			!emailService.sendMail(emailOptions);
		}
	} else {
		// if state didn't change
		if (checkState === 'up') {
			check.uptimeCount = check.uptimeCount + 1;
		} else {
			// down
			check.downtimeCount = check.downtimeCount + 1;
			!emailService.sendMail(emailOptions);
		}
	}

	check.state = checkState;
	check.lastCheckDate = new Date();

	return await check.save();
}

async function executeCheck(check) {
	let requestOpts = {
		baseURL: `${check.protocol}://${check.url}`,
		...(check.httpHeaders.length > 0 && { headers: Object.assign({}, ...check?.httpHeaders) }), // conditionally add to objects
		...(check.authentication && {
			auth: {
				username: check?.authentication?.username,
				password: check?.authentication?.password,
			},
		}),
		timeout: check?.timeout,
		method: check?.method.toUpperCase(),
		url: check?.path && check.path,
	};

	let checkResult = {
		error: false,
		statusCode: null,
		message: null,
	};

	const checkState = await axios(requestOpts)
		.then(res => {
			checkResult.statusCode = res.status;
			checkResult.message = res.statusText;
			checkResult.responseTime = res.duration;
		})
		.catch(async error => {
			if (error.response) {
				checkResult.statusCode = error.response.status;
			}
			checkResult.error = true;
			checkResult.message = error.message || error.code;
			checkResult.responseTime = error.duration;
		})
		.then(async () => {
			return await determineCheckState(check, checkResult);
		});

	await updateCheck(check, checkResult, checkState);
}

async function addCronJob(job, check, callback) {
	return manager.add(job.key, job.expression, callback.bind(this, check));
}

function init() {
	setInterval(async () => {
		try {
			console.log('tick');
			const checks = await checkService.fetchAll();

			for (const check of checks) {
				if (check.job) {
					if (check.shouldRun) {
						if (manager.exists(check.job.key)) {
							manager.start(check.job.key);
						} else {
							await addCronJob(check.job, check, executeCheck.bind(this, check));
							manager.start(check.job.key);
						}
					} else {
						if (manager.exists(check?.job?.key)) {
							manager.stop(check.job.key);
						}
					}
				} else {
					const job = await jobService.create(check);
					await addCronJob(job, check, executeCheck);
					manager.start(job.key);
					checkService.update(check._id, { job });
				}
			}
		} catch (e) {
			console.log(e);
		}
	}, 1000 * 60);
}

module.exports = { manager, init };
