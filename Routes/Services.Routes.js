const express = require('express');
const mongoose = require('mongoose');
const ServiceSchema = require('../schema/serviceSchema');

const router = express.Router();

const Services = new mongoose.model("packages", ServiceSchema);


// create 
router.post('/create', async (req, res) => {
	try {
		const { vehicle, price, creatorName, length, title } = req.body;
		const Pictures = req.files.picture;
		const PictureData = await Pictures.data;
		const encodePicture = await PictureData.toString('base64');
		const PictureImageBuffer = Buffer.from(encodePicture, 'base64');
		const newService = new Services({
			title,
			vehicle,
			price,
			creatorName,
			length,
			picture: PictureImageBuffer,
		});
		const result = await newService.save();
		res.send(result);
	} catch (error) {
		res.send(error);
	}
});
// all services
router.get('/', async (req, res) => {
	try {
		const result = await Services.find({});
		res.send(result)
	} catch (error) {
		res.send(error);
	}
});
// Id related
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const query = { _id: id };
		const result = await Services.findOne(query);
		res.send(result)
	} catch (error) {
		res.send(error);
	}
})

module.exports = router;
