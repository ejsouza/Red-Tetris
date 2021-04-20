import { Response, Request, NextFunction } from 'express';
import GameSchema from '../schemas/GameSchema';
import { Game } from '../models/Game';
import { IGame } from '../interfaces/game.interface';

export const getGames = async (req: Request, res: Response, next: NextFunction) => {
  GameSchema.find()
    .exec()
    .then((games) => {
      res.status(200).json({ success: true, games });
    })
    .catch((error) => {
      res.status(404).json({ success: false, error });
    });
};

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gameProps = req.body as IGame;
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
