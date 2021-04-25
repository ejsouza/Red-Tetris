import GameSchema from '../schemas/GameSchema';
import { IGame } from '../interfaces/game.interface';

interface GameProps {
  name: string;
  players: string[];
  numberOfPlayers: number;
}

export class Game {
  constructor(private game: GameProps) {}

  get name(): string {
    return this.game.name;
  }

  get players(): string[] {
    return this.game.players.map((player) => player);
  }

  fetch(): void {
    GameSchema.find()
      .exec()
      .then((games) => {
        console.log(`games retrivied ${games}`);
      })
      .catch((err) => {
        console.log(`error retrivieng games ${err}`);
      });
  }
  async save() {
    this.game.numberOfPlayers = this.game.players.length;
    const game = new GameSchema(this.game);

    try {
			const gameSaved = await game.save();
			return gameSaved;
		} catch ( err ) {
			if ( err.code === 11000 ) {
				throw new Error(
					`'${err.keyValue.name}' is already in use, please choose another one.`
				);
			} else {
				/**
				 * The + 1 is for removing the ':' that is included in the indexOf
				 */
				throw new Error(
					err.message.slice( err.message.lastIndexOf( ':' ) + 1 ).trim()
				);
			}
		}
  }
}
