const express = require('express');
const mongoose = require('mongoose');
const AdminSchema = require('../schema/adminSchema');
const RiderSchema = require('../schema/riderSchema');
const LearnerSchema = require('../schema/learnerSchema');


const router = express.Router();

const Rider = new mongoose.model("riders", RiderSchema);
const Learner = new mongoose.model("learners", LearnerSchema);
const Admin = new mongoose.model("admins", AdminSchema);

// Create Admin
router.post('/create', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body?.password, 10);
		const riderMatched = await Rider.findOne({ email: req.body?.email })
		const learnerMatched = await Learner.findOne({ email: req.body?.email })
		const AdminMatched = await Admin.findOne({ email: req.body?.email })
		if (riderMatched || learnerMatched || AdminMatched) {
			return res.json({ error: `${req.body?.email} is already register`, });
		}
		const newAdmin = new Admin({
			email: req.body.email,
			password: hashedPassword,
			role: "admin",
		});
		const result = await newAdmin.save();
		res.json({ success: true });
	} catch (error) {
		res.send(error);
	}
});

// All Admin List
router.get('/', async (req, res) => {
	try {
		const result = await Admin.find({});
		res.status(200).json({ success: true, result })
	} catch (error) {
		res.send(error.message)
	}
});


module.exports = router;