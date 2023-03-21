const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RiderSchema = require('../schema/riderSchema');
const LearnerSchema = require('../schema/learnerSchema');
const ObjectId = require('mongodb').ObjectId;

const router = express.Router();

const Rider = new mongoose.model("rider", RiderSchema);
const Learner = new mongoose.model("learner", LearnerSchema);

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
		if (riderMatched || learnerMatched) {
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
router.post('/learner', async (req, res) => {
	console.log(req.body);
	console.log(req.files);
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
			profilePicture: profilePictureImageBuffer,
			nidPicture: nidPictureImageBuffer,
		});
		const result = await newLearner.save();
		res.json({ success: true, result });

	} catch (error) {
		res.send(error);
	}
})
router.get('/login', async (req, res) => {
	res.send('Hello Login')
})

module.exports = router;
