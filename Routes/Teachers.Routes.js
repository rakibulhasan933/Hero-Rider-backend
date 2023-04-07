const express = require('express');
const mongoose = require('mongoose');
const LearnerSchema = require('../schema/learnerSchema');
const AdminVerify = require('../helpers/admin_verify');
const JWTVerify = require('../helpers/jwt_verify');


const router = express.Router();
const Learner = new mongoose.model("learners", LearnerSchema);

// ALL Teachers
router.get('/', JWTVerify, AdminVerify, async (req, res) => {
	const result = await Learner.find({});
	res.json(result);
});


module.exports = router;