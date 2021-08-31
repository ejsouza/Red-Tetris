import * as express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { BaseURL } from './config/const';
import { DB } from './db';

interface IController {
  path: string;
  router: express.Router;
}

dotenv.config();

export class App {
  public app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express.default();

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
    }
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
      if (process.env.NODE_ENV !== 'test') {
        console.log(
          `\n ⚡️ [server]: App listening on port ${process.env.PORT}`
        );
      }
    });
  }
}
