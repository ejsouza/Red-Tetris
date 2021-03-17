import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
const {
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_HOSTNAME,
	MONGO_CONTAINER,
	MONGO_PORT,
	MONGO_DB,
} = process.env;

const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
};

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// mongoose.connect(url, options).then(() => {
// 	console.log(`MangoDB is connected`);
// }).catch((error: any) => {
// 	console.log(`MangoDB ERROR >>> ${error}`)
// });
console.log('here ', MONGO_PORT)
const urlLocal = `mongodb://localhost:${MONGO_PORT}/${MONGO_DB}`
const urlDocker = `mongodb://${MONGO_USERNAME}:${MONGO_PORT}/${MONGO_DB}`

const connectDB = async () => {
	const conn = await mongoose.connect(urlLocal, options)
	console.log(`MongoDB connected: ${conn.connection.host}`);
	return conn;
}

export default connectDB;