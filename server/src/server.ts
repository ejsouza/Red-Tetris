import * as mongoose from 'mongoose';
import 'dotenv/config';
import { App } from './app';
import { GamesController } from './controllers/games/games.controller';
import { AuthController } from './controllers/auth';
import { TokenController } from './controllers/token';
import { UserController } from './controllers/user';

const { PORT } = process.env;

const app = new App([
  new GamesController(),
  new AuthController(),
  new TokenController(),
  new UserController(),
]);

app.listen();
