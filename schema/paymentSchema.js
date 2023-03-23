const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	course: {
		type: String,
		required: true,
	},
	transactionId: {
		type: Buffer,
		required: true,
	},
	services: {
		type: String,
		required: true,
	},

});

module.exports = PaymentSchema;