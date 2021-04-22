import { Response, Request, NextFunction } from 'express';
import GameSchema from '../schemas/GameSchema';
import { Game } from '../models/Game';
import { IGame } from '../interfaces/game.interface';

/**
 * Use “verb” to denote controller archetype.
 */

export const get = async (req: Request, res: Response, next: NextFunction) => {
  GameSchema.find()
    .exec()
    .then((games) => {
      res.status(200).json({ success: true, games });
    })
    .catch((error) => {
      res.status(404).json({ success: false, error });
    });
};

export const create = async (
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

export const close = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { game } = req.body;
	console.log(`gameName =: ${game}`);
  GameSchema.findOneAndUpdate({ name: game }, { open: false }, { new: true })
    .exec()
    .then((response) => {
      console.log(`Updated ${response}`);
      res.status(201).json({ success: true, response });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: err.message });
    });
};
