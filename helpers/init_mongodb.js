const mongoose = require('mongoose');
require('dotenv').config();

// Database Connected
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t2kmaoa.mongodb.net/?retryWrites=true&w=majority`, {
	dbName: process.env.DB_NAME,
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => console.log("Database Connected")).catch((error) => console.log(error.message));

mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
	console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
	await mongoose.connection.close()
	process.exit(0)
});