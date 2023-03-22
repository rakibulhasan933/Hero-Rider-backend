const mongoose = require("mongoose");
const AdminSchema = require("../schema/adminSchema");


const Admin = new mongoose.model("admins", AdminSchema);


const AdminVerify = async (req, res, next) => {
	const requester = req?.decoded.email;
	const requesterAccount = await Admin.findOne({ email: requester });
	if (requesterAccount?.role === 'admin') {
		next();
	}
	else {
		res.status(403).send({ message: 'forbidden access' });
	}
};
module.exports = AdminVerify;