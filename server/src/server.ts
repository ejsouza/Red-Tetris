import * as mongoose from 'mongoose';
import 'dotenv/config';
import { App } from './app';
import { GamesController } from './controllers/games/games.controller';

const {  PORT  } = process.env;

const app = new App([new GamesController()]);

app.listen();
