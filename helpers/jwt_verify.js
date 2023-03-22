const jwt = require('jsonwebtoken');

const JWTVerify = async (req, res, next) => {

	const authHeader = req.headers.authorization;
	try {
		if (!authHeader) {
			return res.status(401).send({ message: 'Unauthorized access' });
		};
		const token = await authHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_PRIVATE_KEY, function (decoded) {
			req.decoded = decoded;
			console.log(req.decoded);
			next();
		});
	} catch (error) {
		res.status(403).send({ message: 'Forbidden access' })
	}
};

module.exports = JWTVerify;