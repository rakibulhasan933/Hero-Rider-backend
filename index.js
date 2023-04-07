const express = require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cors = require('cors');
dotenv.config();
require('./helpers/init_mongodb');
const UserRoute = require('./Routes/Auth.Routes');
const ServiceRoute = require('./Routes/Services.Routes');
const RiderRoute = require('./Routes/Rider.Routes');


const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use('/auth', UserRoute);
app.use('/services', ServiceRoute);
app.use('/rider', RiderRoute);


app.get('/', (req, res) =>
	res.send(`Authentication Server Running port on ${port}`)
)
// Not Found 
app.use((req, res, next) => {
	next('Not Found');
});

// Error Handler
function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err)
	}
	res.status(400).json({
		error: err
	});
};

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Authentication Server listening on port ${port}`)
});