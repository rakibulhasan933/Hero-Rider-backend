const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
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
	role: {
		type: String,
		required: true,
	},
});

module.exports = AdminSchema;