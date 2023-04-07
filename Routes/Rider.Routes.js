const express = require('express');
const mongoose = require('mongoose');
const RiderSchema = require('../schema/riderSchema');

const router = express.Router();

const Rider = new mongoose.model("riders", RiderSchema);


// Search Query
router.get('/', async (req, res) => {
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
			}).skip(skips).limit(5).sort('age');
		} else if (highest > lowest) {
			students = await Rider.find({
				$and: [
					{ age: { $gte: lowest } }, { age: { $lte: highest } }
				]
			}).skip(skips).limit(5).sort('age');
		} else {
			students = await Rider.find({}).skip(skips).limit(5).sort('age');
		}
		if (students) {
			res.send({ success: true, students });
		}
	} catch (error) {
		res.send(error);
	}
});

// ID Species 
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const result = await Rider.findOne({ _id: id });
		res.status(200).send(result);
	} catch (error) {
		res.json({ error: "authroziation error" });
		console.log({ error });
	}

})


module.exports = router;