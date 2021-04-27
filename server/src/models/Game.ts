import GameSchema from '../schemas/GameSchema';
import { IGame } from '../interfaces/game.interface';
import { MAX_NUMBER_OF_PLAYERS } from '../config/const';


interface GameProps {
  name: string;
  players: string[];
  numberOfPlayers: number;
  open: boolean;
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
    this.game.open = this.game.numberOfPlayers < MAX_NUMBER_OF_PLAYERS;
    const game = new GameSchema(this.game);

    try {
      const gameSaved = await game.save();
      return gameSaved;
    } catch (err) {
      if (err.code === 11000) {
        throw new Error(
          `'${err.keyValue.name}' is already in use, please choose another one.`
        );
      } else {
        /**
         * The + 1 is for removing the ':' that is included in the indexOf
         */
        throw new Error(
          err.message.slice(err.message.lastIndexOf(':') + 1).trim()
        );
      }
    }
  }

  async addPlayer(name: string, player: string) {
    const numberOfPlayers = this.game.players.length;
    const open = numberOfPlayers + 1 < MAX_NUMBER_OF_PLAYERS;
    GameSchema.findOneAndUpdate(
      { name: name },
      { numberOfPlayers: numberOfPlayers, players: player, open: open }
    );
  }
}
