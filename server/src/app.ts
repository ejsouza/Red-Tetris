import * as express from 'express';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as socketio from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {BaseURL} from './config/const';

interface IController {
	path: string;
	router: express.Router;
}

export class App {
	public app: express.Application;
	public port: number;

	constructor(controllers: IController [], port: number) {
		this.app = express.default();
		this.port = port;
	
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
	}

	private initializeMiddlewares() {
		this.app.use(express.json());
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(express.urlencoded({extended: true}));
	}

	private initializeControllers(controllers: IController[]) {
		controllers.forEach((controller) => {
			this.app.use(`${BaseURL}`, controller.router);
		});
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`⚡️ [server]: App listening on port ${this.port}`);
			console.log('🛑 [stop] Press CTRL-C\n');
		});
	}
}