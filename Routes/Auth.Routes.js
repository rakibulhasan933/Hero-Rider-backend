const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RiderSchema = require('../schema/riderSchema');
const LearnerSchema = require('../schema/learnerSchema');
const AdminSchema = require('../schema/adminSchema');

const router = express.Router();

const Rider = new mongoose.model("riders", RiderSchema);
const Learner = new mongoose.model("learners", LearnerSchema);
const Admin = new mongoose.model("admins", AdminSchema);


// Create Rider 
router.post('/rider', async (req, res) => {
	try {
		// Picture Convert base64 profilePicture
		const profilePictures = req.files.profilePicture;
		const profilePictureData = await profilePictures.data;
		const encodeProfilePicture = await profilePictureData.toString('base64');
		const profilePictureImageBuffer = Buffer.from(encodeProfilePicture, 'base64');

		// Picture Convert base64 drivingLicense
		const drivingLicenses = req.files.drivingLicense;
		const drivingLicenseData = await drivingLicenses.data;
		const encodeDrivingLicense = await drivingLicenseData.toString('base64');
		const drivingLicenseImageBuffer = Buffer.from(encodeDrivingLicense, 'base64');

		// Picture Convert base64 nidPicture
		const nidPictures = req.files.nidPicture;
		const nidPictureData = await nidPictures.data;
		const encodeNidPicture = await nidPictureData.toString('base64');
		const nidPictureImageBuffer = Buffer.from(encodeNidPicture, 'base64');

		// Picture Convert base64 carNamePlate
		const carNamePlates = req.files.carNamePlate;
		const carNamePlateData = await carNamePlates.data;
		const encodeCarNamePlate = await carNamePlateData.toString('base64');
		const carNamePlateImageBuffer = Buffer.from(encodeCarNamePlate, 'base64');

		const hashedPassword = await bcrypt.hash(req.body?.password, 10);
		const riderMatched = await Rider.findOne({ email: req.body?.email })
		const learnerMatched = await Learner.findOne({ email: req.body?.email })
		const AdminMatched = await Admin.findOne({ email: req.body?.email })
		if (riderMatched || learnerMatched || AdminMatched) {
			return res.json({ error: `${req.body?.email} is already register`, });
		}
		const newRider = new Rider({
			name: req.body?.name,
			email: req.body?.email,
			password: hashedPassword,
			age: req.body?.age,
			phone: req.body?.phone,
			area: req.body?.area,
			address: req.body?.address,
			carName: req.body?.carName,
			carModel: req.body?.carModel,
			vehicle: req.body?.vehicle,
			role: "student",
			profilePicture: profilePictureImageBuffer,
			drivingLicense: drivingLicenseImageBuffer,
			nidPicture: nidPictureImageBuffer,
			carNamePlate: carNamePlateImageBuffer,
		});
		const result = await newRider.save();
		res.json({ success: true });
	} catch (error) {
		res.send(error);
	}
});

// Create Admin
router.post('/addAdmin', async (req, res) => {
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

// Create Teacher
router.post('/learner', async (req, res) => {
	try {
		// Picture Convert base64 profilePicture
		const profilePictures = req.files.profilePicture;
		const profilePictureData = await profilePictures.data;
		const encodeProfilePicture = await profilePictureData.toString('base64');
		const profilePictureImageBuffer = Buffer.from(encodeProfilePicture, 'base64');

		// Picture Convert base64 nidPicture
		const nidPictures = req.files.nidPicture;
		const nidPictureData = await nidPictures.data;
		const encodeNidPicture = await nidPictureData.toString('base64');
		const nidPictureImageBuffer = Buffer.from(encodeNidPicture, 'base64');

		const hashedPassword = await bcrypt.hash(req.body?.password, 10);
		const riderMatched = await Rider.findOne({ email: req.body?.email })
		const learnerMatched = await Learner.findOne({ email: req.body?.email })
		if (riderMatched || learnerMatched) {
			return res.json({ error: `${req.body?.email} is already register`, });
		}
		const newLearner = new Learner({
			name: req.body?.name,
			email: req.body?.email,
			password: hashedPassword,
			age: req.body?.age,
			phone: req.body?.phone,
			address: req.body?.address,
			vehicle: req.body?.vehicle,
			role: req.body?.role,
			profilePicture: profilePictureImageBuffer,
			nidPicture: nidPictureImageBuffer,
			role: "teacher"
		});
		const result = await newLearner.save();
		res.json({ success: true });

	} catch (error) {
		res.send(error);
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const riderMatched = await Rider.findOne({ email: req.body?.email })
		const learnerMatched = await Learner.findOne({ email: req.body?.email });
		const user = riderMatched || learnerMatched;
		if (user) {
			const isValidPassword = await bcrypt.compare(req.body.password, user?.password);
			if (!isValidPassword) {
				res.status(401).json({
					"error": "Authentication failed"
				});
			} else {
				const token = jwt.sign({
					email: user.email,
					userId: user._id,
				}, process.env.JWT_PRIVATE_KEY, { expiresIn: '10h', issuer: 'hero-rider.com', });
				res.json({
					success: true,
					access_token: token,
					email: user.email,
				});
			}
		} else {
			return res.json({ error: `${req.body.email} not register user, Please Register than try Login` })
		}
	} catch (error) {
		res.send(error);
	}
});


// Get ALL Students
router.get('/student', async (req, res) => {
	try {
		const search = req.query.search;
		const highest = req.query.highest;
		const lowest = req.query.lowest;
		const page = Number(req.query.page) || 1;
		const skips = (page - 1) * 5;
		let students;
		if (search) {
			students = await Rider.find({
				$or: [
					{ name: new RegExp(search, "i") },
					{ email: new RegExp(search, "i") },
					{ phone: new RegExp(search, "i") }
				]
			}).skip(skips).limit(5);
		} else if (highest > lowest) {
			students = await Rider.find({
				$and: [
					{ age: { $gte: lowest } }, { age: { $lte: highest } }
				]
			}).skip(skips).limit(5);
		} else {
			students = await Rider.find({}).skip(skips).limit(5);
		}
		if (students) {
			const data = await students.sort((a, b) => a.age - b.age);
			res.send({ success: true, data });
		}
	} catch (error) {
		res.send(error);
	}
});
// Age Search
router.get('/age', async (req, res) => {
	try {

		let students;
		if (highest && lowest) {

		} else {
			students = await Rider.find({});
		}
		if (students) {
			const data = await students.sort((a, b) => b.age - a.age);
			res.send({ success: true, data });
		}
	} catch (error) {
		res.send(error);
	}
})

// ALL Teachers
router.get('/teachers', async (req, res) => {
	const result = await Learner.find({});
	res.json(result);
});

//GET ID FILTER
router.get('/:email', async (req, res) => {
	try {
		const email = req.params.email;
		const rider = await Rider.findOne({ email: email });
		const learner = await Learner.findOne({ email: email });
		const admin = await Admin.findOne({ email: email });
		const matched = rider || learner || admin;
		res.send(matched);
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;
