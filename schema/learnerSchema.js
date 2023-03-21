const mongoose = require('mongoose');

const LearnerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		lowerCase: true,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	vehicle: {
		type: String,
		required: true,
	},
	profilePicture: {
		type: Buffer,
		required: true,
	},
	nidPicture: {
		type: Buffer,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
});

module.exports = LearnerSchema;