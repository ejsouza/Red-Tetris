import { Response, Request, NextFunction } from 'express';
import GameSchema from '../schemas/GameSchema';
import { Game } from '../models/Game';
import { IGame } from '../interfaces/game.interface';
import { MAX_NUMBER_OF_PLAYERS } from '../config/const';

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

export const getByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;

  GameSchema.findOne({ name: name })
    .exec()
    .then((game) => {
      if (!game) {
        return res
          .status(200)
          .json({ success: false, ok: true, msg: `Game not found` });
      }
      res.status(200).json({ success: true, game });
    })
    .catch((err) => {
      res
        .status(404)
        .json({ success: false, msg: `Game '${name}' doesn't exist` });
    });
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const addUserToGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { game, player } = req.body;

  console.log(`addUserToGame ${game} - ${player}`);

  const toUpdate: IGame = await GameSchema.findOne({ name: game });
  const numberOfPlayers = toUpdate.numberOfPlayers;
  toUpdate.players.push(player);
  toUpdate.numberOfPlayers = numberOfPlayers + 1;
  toUpdate.open = numberOfPlayers + 1 <= MAX_NUMBER_OF_PLAYERS;
  await toUpdate.save();
  console.log(`findOne: ${toUpdate.open} - ${numberOfPlayers}`);

  // toUpdate.addPlayer()

  res.status(201).json({
    success: true,
    msg: `Added player '${player}' to game '${game}'`,
    game: toUpdate,
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

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  console.log(`params := ${name}`);
  GameSchema.findOneAndDelete({ name: name })
    .exec()
    .then((response) => {
      console.log(`Game '${name}' was removed successfull `, response);
      if (!response) {
        return res
          .status(400)
          .json({ success: false, msg: `Game '${name}' doesn't exist` });
      }
      return res.status(200).json({
        success: true,
        msg: `Game '${name}' was removed successfull `,
        game: response,
      });
    })
    .catch((err) => {
      console.log(
        `Something went wrong when trying to remove game '${name} '`,
        err
      );
      res.status(500).json({
        success: false,
        msg: `Something went wrong when trying to remove game '${name}'`,
        err,
      });
    });
};
