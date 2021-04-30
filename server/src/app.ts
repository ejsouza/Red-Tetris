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
  public app: express.Application;
	public server: http.Server;
	public io: socketio.Server;

  constructor(controllers: IController[]) {
    this.app = express.default();
		this.server = http.createServer(this.app);
		this.io = new socketio.Server({
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

		this.io.attach(this.server);

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeIO();
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

  private initializeIO() {
    this.io.on('connection', (socket: socketio.Socket) => {
      console.log('connection');
      socket.emit('status', 'Hello from Socket.io');

      console.log(socket.handshake.query);

      socket.on('disconnect', () => {
        console.log('client disconnected');
      });
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