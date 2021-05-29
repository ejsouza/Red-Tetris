import * as express from 'express';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as socketio from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { BaseURL } from './config/const';
import { DB } from './db';

interface IController {
  path: string;
  router: express.Router;
}

export class App {
  private app: express.Application;
	private server: http.Server;

  constructor(controllers: IController[]) {
    this.app = express.default();
		this.server = http.createServer(this.app);

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
    new DB();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`\n ⚡️ [server]: App listening on port ${process.env.PORT}`);
    });

  }
}