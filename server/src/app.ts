import * as express from 'express';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as socketio from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { BaseURL } from './config/const';
import connectDB from './db';

interface IController {
	path: string;
	router: express.Router;
}

export class App {
  public app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express.default();

		this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use(`${BaseURL}`, controller.router);
    });
  }

	private connectToDatabase() {
		const db = connectDB();

		db.then(() => {
			console.log(`💾 Connection to database successfull`);
      console.log('🛑 [stop] Press CTRL-C\n');
		})
	}

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`\n⚡️ [server]: App listening on port ${process.env.PORT}`);
    });
  }
}