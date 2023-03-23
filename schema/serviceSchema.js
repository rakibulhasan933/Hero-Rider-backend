const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	picture: {
		type: Buffer,
		required: true,
	},
	creatorName: {
		type: String,
		required: true,
	},
	length: {
		type: String,
		required: true,
	},
	vehicle: {
		type: String,
		required: true,
	},

});

module.exports = ServiceSchema;