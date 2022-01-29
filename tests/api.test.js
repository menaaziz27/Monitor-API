const app = require('../src/app');
const User = require('../src/models/User');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../src/services/email.service');
require('dotenv').config();

beforeEach(done => {
	mongoose.connect(
		process.env.MONGO_TEST_URI,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		() => done()
	);
});

afterEach(done => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done());
	});
});

test('POST /v1/api/auth/register', async () => {
	const data = {
		email: 'menaaziz789@gmail.com',
		password: 'testing123456',
	};
	console.log({ data });
	await supertest(app)
		.post('/v1/api/auth/register')
		.send(data)
		.then(response => {
			// Check the response
			expect(response.status).toBe(201);

			console.log({ response });
		});
});
