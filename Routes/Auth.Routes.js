const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RiderSchema = require('../schema/riderSchema');
const LearnerSchema = require('../schema/learnerSchema');
const AdminSchema = require('../schema/adminSchema');
const JWTVerify = require('../helpers/jwt_verify');
const AdminVerify = require('../helpers/admin_verify');
const PaymentSchema = require('../schema/paymentSchema');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

const Rider = new mongoose.model("riders", RiderSchema);
const Learner = new mongoose.model("learners", LearnerSchema);
const Admin = new mongoose.model("admins", AdminSchema);
const Payment = new mongoose.model("completed", PaymentSchema);

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
			blocked: false,
		});
		const result = await newRider.save();
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
		res.json({ success: true, result });

	} catch (error) {
		res.send(error);
	}
});



// Login
router.post('/login', async (req, res) => {
	try {
		const riderMatched = await Rider.findOne({ email: req.body?.email })
		const learnerMatched = await Learner.findOne({ email: req.body?.email });
		const AdminMatched = await Admin.findOne({ email: req.body?.email });
		const user = riderMatched || learnerMatched || AdminMatched;
		if (user) {
			const isValidPassword = await bcrypt.compare(req.body.password, user?.password);
			if (!isValidPassword) {
				res.status(401).json({
					"error": "Authentication failed"
				});
			} else {
				const token = jwt.sign({
					email: user.email,
					id: user._id,
				}, process.env.JWT_PRIVATE_KEY, { expiresIn: '10h', issuer: 'hero-rider.com', });
				res.json({
					success: true,
					access_token: token,
					email: user.email,
					id: user._id
				});
			}
		} else {
			return res.json({ error: `${req.body.email} not register user, Please Register than try Login` })
		}
	} catch (error) {
		res.send(error);
	}
});


//GET ID FILTER
router.get('/user/:email', async (req, res) => {
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

// Add Block User
router.patch('/block/:email', async (req, res) => {
	try {
		const email = req.params.email;
		const result = await Rider.updateOne({ email: email }, {
			$set: {
				blocked: true,
			},
		}, { new: true });
		res.send({ success: true, result });
	} catch (error) {
		res.send(error);
	}
});

// Removed Block
router.patch('/remove-block/:email', async (req, res) => {
	try {
		const email = req.params.email;
		const result = await Rider.updateOne({ email: email }, {
			$set: {
				blocked: false,
			},
		}, { new: true });
		res.send({ success: true, result });
	} catch (error) {
		res.send(error);
	}
});
// Payment
router.post('/payment', async (req, res) => {
	try {
		const price = req.body.price;
		const amount = price * 100;
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "usd",
			payment_method_types: [
				"card"
			],
		});
		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		res.send(error);
	}
});
// payment Saved
router.post('/payment-saved', async (req, res) => {
	try {
		const { name, email, course, services, transactionId } = req.body;
		const newPayment = new Payment({
			name,
			email,
			course,
			services,
			transactionId,
		});
		const result = await newPayment.save();
		res.send(result);
	} catch (error) {
		res.send(error)
	}
});

// all completed Payment
router.get('/completed-payment', async (req, res) => {
	try {
		const result = await Payment.find({});
		res.send(result);
	} catch (error) {
		res.send(error);
	}
});



module.exports = router;
