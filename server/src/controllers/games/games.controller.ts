import * as express from 'express';
import GameModelSchema from '../../schemas/GameSchema';
import { Game } from '../../models/Game';
import { IGame } from '../../interfaces/game.interface';


export class GamesController {
  public path = '/games';
  public router = express.Router();
  private _game = GameModelSchema;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllGames);
    this.router.get(`${this.path}/:id`, this.getByName);
    this.router.post(this.path, this.createGame);
    this.router.patch(`${this.path}/:id`, this.addPlayerToGame );
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

  getByName = (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    this._game
      .findOne({ name: id })
      .then((game) => {
        if (!game) {
          return res.status(200).json({ success: false, ok: false, game });
        }
        res.status(200).json({ success: true, ok: true, game });
      })
      .catch((err) => {
        res.status(500).json({ success: false, err });
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

  addPlayerToGame = (req: express.Request, res: express.Response) => {
    const props = req.body as IGame;
    const {name, players} = props;
    console.log(`game ${name} players ${players}`);
    const filter = {name: name};
    const update = { $push: { players: players }, $inc: {'numberOfPlayers': 1}};
    this._game
      .findOneAndUpdate(filter, update, { new: true })
      .then((game) => {
         if (!game) {
          return res.status(200).json({ success: false, ok: false, game });
        }
        res.status(200).json({ success: true, ok: true, game });
      })
      .catch((err) => {
        res.status(500).json({ success: false, err });
      });
  }
}
