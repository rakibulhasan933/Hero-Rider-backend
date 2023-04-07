const jwt = require('jsonwebtoken');

const JWTVerify = async (req, res, next) => {
	const { authorization } = req.headers;
	try {
		const token = await authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		const { email, _id } = decoded;
		req.email = email;
		req.id = _id;
		next();
	} catch (error) {
		next(error.message);
	}
};

module.exports = JWTVerify;

