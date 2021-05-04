import mongoose from 'mongoose';
import IGame from '../interfaces/game.interface';

const Game = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A game shall have a name'],
    unique: [true, 'Game shall have a unique name'],
    trim: true,
    minlength: [4, 'Game name should be at least 4 characters long'],
    maxlength: [10, 'Game name should not be more than 10 characters long'],
  },
  players: [String],
  open: {
    type: Boolean,
    default: true,
  },
  over: {
    type: Boolean,
    default: false,
  },
  numberOfPlayers: {
    type: Number,
    required: true,
    min: [1, 'Game needs at least one player'],
    max: [3, 'The max number of players allowed is three'],
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 *  The first argument is the name of the collection that your model is for.
 *  Keep in mind that it is supposed to be singular
 *  Mongoose automatically converts it to a plural version
 *  Therefore a collection named games is created.
 */

const GameModelSchema = mongoose.model<IGame>('Game', Game);
export default GameModelSchema;
