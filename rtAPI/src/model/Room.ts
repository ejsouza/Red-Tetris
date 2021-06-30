import * as socketIO from 'socket.io';
import { Game } from './Game';
import Game__ from './Game__';
import Player from './Player';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';

interface IRoom {
  name: string;
  players: Player[];
  // players: [
  //   {
  //     name: string;
  //     socketId: string;
  //   }
  // ];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

type IPlayer = [
  {
    name: string;
    socketId: string;
  }
];

class Room {
  private _name: string;
  // private _players: IPlayer;
  private _players: Player[];
  private _numberOfPlayers: number;
  private _host: string;
  private _open: boolean;
  private _game: Game__;

  constructor(args: IRoom) {
    this._name = args.name;
    this._players = args.players;
    this._numberOfPlayers = this.players.length;
    this._host = args.players[0].name;
    this._open = true;
  }

  get name() {
    return this._name;
  }

  get players() {
    return this._players;
  }

  get numberOfPlayers() {
    return this._numberOfPlayers;
  }

  get host() {
    return this._host;
  }

  get open() {
    return this._open;
  }

  set open(state: boolean) {
    this._open = state;
  }

  addPlayer(player: { name: string; socketId: string }) {
    const p = new Player(player.name, player.socketId, false);
    this._players.push(p);
    this._numberOfPlayers++;
    if (this._numberOfPlayers === MAX_NUMBER_OF_PLAYERS) {
      this.open = false;
    }
  }

  newGame(io: socketIO.Server, socket: socketIO.Socket) {
    console.log(`staring new game << ${this._name} >>`);
    this._game = new Game__(io, socket, this.players, this._name);

    const players = this._game.players;

    players.forEach((player) => {
      console.table(player.piece.pos);
      console.table(player.nextPiece[0].pos);
    });
  }

  gameOver() {
    this._game.stopGame();
  }
}

export default Room;
