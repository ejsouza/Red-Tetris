import GameSchema from '../schemas/GameSchema';
import { IGame } from '../interfaces/game.interface';

interface GameProps {
  name?: string;
  players: string[];
  maxPlayers?: number;
}

export class Game {
  constructor(private data: GameProps) {}

  // get() {
  //   GameSchema.find()
  //     .exec()
  //     .then((games) => {
  //       console.log(`in class Game games =: ${games}`);
  //       return games.map((game) => game);
  //     })
  //     .catch((error) => error);
  // }

  get name(): string | undefined {
    return this.data.name;
  }

  get players(): string[] {
    return this.data.players.map((player) => player);
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
  save() {
    console.log(`SAVE =: ${this.data}`);
    this.data.maxPlayers = this.data.players?.length;
    const game = new GameSchema(this.data);

    const saved = game
      .save()
      .then((game) => {
        return game;
      })
      .catch((err) => {
        if (err.code === 11000) {
          console.log(`duplicated error =: ${err.keyValue.name}`);
          throw new Error(
            `'${err.keyValue.name}' is already in use, please choose another one.`
          );
        } else {
          console.log(`error in class Game =: ${err.message}`);
          console.log(`The position of name: `, err.message.indexOf('name:'));
          console.log(
            'Slicing =: ',
            err.message.slice(err.message.indexOf('name:'))
          );

          /**
           * The + 1 is for removing the ':' that is included in the indexOf
           */
          throw new Error(
            err.message.slice(err.message.lastIndexOf(':') + 1).trim()
          );
        }
      });
    return saved;
  }
}
