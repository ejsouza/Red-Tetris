import * as express from 'express';
import GameModelSchema from '../../schemas/GameSchema';
import { Game } from '../../models/Game';
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
    GameModelSchema.find()
      .exec()
      .then((games) => {
        res.status(200).json({ success: true, games });
      })
      .catch((error) => {
        res.status(404).json({ success: false, error });
      });
  };

  createGame = (req: express.Request, res: express.Response) => {
    // TODO
		const gameProps = req.body as IGame;
    console.log(
      `onCreate := ${gameProps.numberOfPlayers} - ${gameProps.name} - ${gameProps.players}`
    );
    const game = new Game(gameProps);
    game
      .save()
      .then((game) => {
        res.status(201).json({ success: true, game });
      })
      .catch((err) => {
        res.status(400).json({ success: false, msg: err.message });
      });
  };
}
