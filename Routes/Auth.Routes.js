const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RiderSchema = require('../schema/riderSchema');
const LearnerSchema = require('../schema/learnerSchema');
const AdminSchema = require('../schema/adminSchema');
const ObjectId = require('mongodb').ObjectId;

const router = express.Router();

const Rider = new mongoose.model("rider", RiderSchema);
const Learner = new mongoose.model("learner", LearnerSchema);
const Admin = new mongoose.model("admin", AdminSchema);

router.post('/rider', async (req, res) => {
	try {
		// Picture Convert base64 profilePicture
		const profilePictures = req.files.profilePicture;
		const profilePictureData = profilePictures.data;
		const encodeProfilePicture = profilePictureData.toString('base64');
		const profilePictureImageBuffer = Buffer.from(encodeProfilePicture, 'base64');

		// Picture Convert base64 drivingLicense
		const drivingLicenses = req.files.drivingLicense;
		const drivingLicenseData = drivingLicenses.data;
		const encodeDrivingLicense = drivingLicenseData.toString('base64');
		const drivingLicenseImageBuffer = Buffer.from(encodeDrivingLicense, 'base64');

		// Picture Convert base64 nidPicture
		const nidPictures = req.files.nidPicture;
		const nidPictureData = nidPictures.data;
		const encodeNidPicture = nidPictureData.toString('base64');
		const nidPictureImageBuffer = Buffer.from(encodeNidPicture, 'base64');

		// Picture Convert base64 carNamePlate
		const carNamePlates = req.files.carNamePlate;
		const carNamePlateData = carNamePlates.data;
		const encodeCarNamePlate = carNamePlateData.toString('base64');
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
			role: 'student',
			profilePicture: profilePictureImageBuffer,
			drivingLicense: drivingLicenseImageBuffer,
			nidPicture: nidPictureImageBuffer,
			carNamePlate: carNamePlateImageBuffer,
		});
		const result = await newRider.save();
		res.json({ success: true, result });
	} catch (error) {
		res.send(error);
	}
});
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
		res.json({ success: true, result });
	} catch (error) {
		res.send(error);
	}
});
router.post('/learner', async (req, res) => {
	try {
		// Picture Convert base64 profilePicture
		const profilePictures = req.files.profilePicture;
		const profilePictureData = profilePictures.data;
		const encodeProfilePicture = profilePictureData.toString('base64');
		const profilePictureImageBuffer = Buffer.from(encodeProfilePicture, 'base64');

		// Picture Convert base64 nidPicture
		const nidPictures = req.files.nidPicture;
		const nidPictureData = nidPictures.data;
		const encodeNidPicture = nidPictureData.toString('base64');
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
		res.json({ success: true, result });

	} catch (error) {
		res.send(error);
	}
});
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
					id: user._id,
				});
			}
		} else {
			return res.json({ error: `${req.body.email} not register user, Please Register than try Login` })
		}
	} catch (error) {
		res.send(error);
	}
})

module.exports = router;
