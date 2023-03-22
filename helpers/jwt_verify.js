const jwt = require('jsonwebtoken');

const JWTVerify = (req, res, next) => {
	const { authorization } = req.headers;
	try {
		const token = authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		const { email } = decoded;
		console.log(decoded);
		req.email = email;
		next();
	} catch (error) {
		next(error.message);
	}
};

module.exports = JWTVerify;

