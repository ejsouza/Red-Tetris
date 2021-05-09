import * as express from 'express';
import GameModelSchema from '../../schemas/GameSchema';
import { Game } from '../../models/Game';
import { IGame } from '../../interfaces/game.interface';


export class GamesController {
  private _path = '/games';
  private _router = express.Router();
  private _game = GameModelSchema;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this._router.get(this._path, this.getAllGames);
    this._router.get(`${this._path}/:id`, this.getByName);
    this._router.post(this._path, this.createGame);
  }

  getAllGames = (req: express.Request, res: express.Response) => {
    // TODO
    this._game
      .find()
      .then((games) => {
        res.status(200).json({ success: true, games });
      })
      .catch((error) => {
        res.status(404).json({ success: false, error });
      });
  };

  getByName = (req: express.Request,  res: express.Response) => {
    const {  id  } = req.params;

    this._game
      .findOne({  name: id  })
        .then((game) => {
          if (!game) {
            return res.status(200).json({ success: false, ok: false, game });
          }
          res.status(200).json({ success: true, ok: true, game });;
        })
        .catch((err) => {
          res.status(500).json({ success: false, err });;
        });
  };

  createGame = (req: express.Request, res: express.Response) => {
    // TODO
    const gameProps = req.body as IGame;
    console.log(
      `onCreate := ${gameProps.numberOfPlayers} - ${gameProps.name} - ${gameProps.players}`
    );
    const newGame = new this._game(gameProps);
    newGame
      .save()
      .then((game: IGame) => {
        res.status(201).json({ success: true, game });
      })
      .catch((err: Error) => {
        res.status(400).json({ success: false, msg: err.message });
      });
  };
}
