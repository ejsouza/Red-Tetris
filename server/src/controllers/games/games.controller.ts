import * as express from 'express';
import IGame from '../../interfaces/game.interface';

export class GamesController {
  public path = '/games';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllGames);
    this.router.post(this.path, this.createGame);
  }

  getAllGames = (req: express.Request, res: express.Response) => {
    // TODO
    res.status(200).json({ success: true, msg: `Testing with classes` });
  };

  createGame = (req: express.Request, res: express.Response) => {
    // TODO
  };
}
