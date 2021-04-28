import { App } from './app';
import { GamesController } from './controllers/games/games.controller';

const app = new App([new GamesController()], 8000);

app.listen();
