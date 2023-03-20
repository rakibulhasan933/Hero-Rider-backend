const mongoose = require('mongoose');

const RiderSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		lowerCase: true,
		unique: true,
	},
	age: {
		type: Number,
		required: true,
	},
	phone: {
		type: Number,
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
	carName: {
		type: String,
		required: true,
	},
	carModel: {
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
	drivingLicense: {
		type: Buffer,
		required: true,
	},
	nidPicture: {
		type: Buffer,
		required: true,
	},
	carNamePlate: {
		type: Buffer,
		required: true,
	},
});

module.exports = RiderSchema;