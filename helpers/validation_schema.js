const Joi = require('joi');

const signUpSchema = Joi.object({
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().min(6).required(),
});

module.exports = {
	signUpSchema,
	loginSchema
};