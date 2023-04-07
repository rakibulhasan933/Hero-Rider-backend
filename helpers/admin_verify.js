const mongoose = require("mongoose");
const AdminSchema = require("../schema/adminSchema");


const Admin = new mongoose.model("admins", AdminSchema);


const AdminVerify = async (req, res, next) => {
	const tokenEmail = req?.email;
	const requesterEmail = await Admin.findOne({ email: tokenEmail });
	const userEmail = await requesterEmail?.email;
	console.log(userEmail)
	if (tokenEmail === userEmail) {
		next();
	}
	else {
		res.status(403).send({ message: 'forbidden access' });
	}
};
module.exports = AdminVerify;