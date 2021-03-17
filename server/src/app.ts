/**
 * Required External Modules
 */

import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import http, {Server} from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './db';
import api from './router/index'
import logger from './middleware/logger';


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
	NODE_ENV,
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
 * Middleware
 */
app.use(logger);

if (NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Mount routers
 */
app.use('/api/v1', api);



/**
 * Mongo
 */

// Docker
// const url = `mongodb://${MONGO_CONTAINER}:${MONGO_PORT}/${MONGO_DB}`

// Local
// const url = `mongodb://localhost:${MONGO_PORT}/test`
// mongoose.connect(url, options).then(() => {
//    console.log(`MangoDB is connected`);
//    server.listen(PORT, () => {
//     console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
// 		console.log('  Press CTRL-C to stop\n');
//   });
//  }).catch((error: any) => {
//    console.log(`MangoDB ERROR >>> ${error}`)
//  });

const db = connectDB();

db.then(() => {
	console.log(`MangoDB is connected`);
   server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
		console.log('  Press CTRL-C to stop\n');
  });

}).catch(error => {
	console.log(`MangoDB connection ERROR ${error}`);
})


