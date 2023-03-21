const mongoose = require('mongoose');

const RiderSchema = mongoose.Schema({
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
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	area: {
		type: String,
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
	drivingLicense: {
		type: Buffer,
		required: true,
	},
	carName: {
		type: String,
		required: true,
	},
	carModel: {
		type: String,
		required: true,
	},
	carNamePlate: {
		type: Buffer,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
});

module.exports = RiderSchema;