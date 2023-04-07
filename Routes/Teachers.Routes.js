const express = require('express');
const mongoose = require('mongoose');
const LearnerSchema = require('../schema/learnerSchema');


const router = express.Router();
const Learner = new mongoose.model("learners", LearnerSchema);

// ALL Teachers
router.get('/', async (req, res) => {
	const result = await Learner.find({});
	res.json(result);
});


module.exports = router;