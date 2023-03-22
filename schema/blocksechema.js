const mongoose = require('mongoose');

const BlockSchema = mongoose.Schema({
	email: {
		type: String,
		lowerCase: true,
		unique: true,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	block: {
		type: Boolean,
		required: true,
	},
});

module.exports = BlockSchema;