/**
 * Required External Modules
 */

import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import http, {Server} from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import api from './router/index'

dotenv.config();

/**
 * App Variables
 */

 const {
	MONGO_USERNAME,
	MONGO_CONTAINER,
	MONGO_PASSWORD,
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_DB,
} = process.env;


const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

if (!process.env.PORT) {
  console.log(`Failed to load process.env exiting...`);
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);


const app: Application = express();
const server: Server = http.createServer(app);

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(api);



/**
 * Mongo
 */

//  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

 const url = `mongodb://${MONGO_CONTAINER}:${MONGO_PORT}/${MONGO_DB}`
//  mongoose.connect(url, options).then(() => {
mongoose.connect(url, options).then(() => {
   console.log(`MangoDB is connected`);
   server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
		console.log("  Press CTRL-C to stop\n");
  });
 }).catch((error: any) => {
   console.log(`MangoDB ERROR >>> ${error}`)
 });



