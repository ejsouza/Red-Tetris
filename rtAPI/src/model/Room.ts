import * as socketIO from 'socket.io';
import { Game } from './Game';
import Game__ from './Game__';
import Player from './Player';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';
import { emitInfoShadows } from '../controller/RoomController';

interface IRoom {
  name: string;
  players: Player[];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

class Room {
  private _name: string;
  private _players: Player[];
  private _playersBackUp: Player[];
  private _numberOfPlayers: number;
  private _host: string;
  private _open: boolean;
  private _game: Game__;

  constructor(args: IRoom) {
    this._name = args.name;
    this._players = args.players;
    this._playersBackUp = [];
    this._numberOfPlayers = this.players.length;
    this._host = args.players[0].name;
    this._open = true;
  }

  get game() {
    return this._game;
  }

  get name() {
    return this._name;
  }

  get players() {
    return this._players;
  }

  get playersBackUp() {
    return this._playersBackUp;
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

  get gameMode() {
    return this._game.mode;
  }

  addPlayer(player: { name: string; socketId: string }) {
    const p = new Player(player.name, player.socketId, false);
    this._players.push(p);
    this._numberOfPlayers++;
    if (this._numberOfPlayers === MAX_NUMBER_OF_PLAYERS) {
      this.open = false;
    }
  }

  newGame(io: socketIO.Server, socket: socketIO.Socket, speed: number) {
    console.log(`staring new game << ${this._name} >>`);
    this._game = new Game__(io, socket, this.players, this._name, speed);
    const players = this._game.players;
    // Clean backUp array before adding players to it
    this._playersBackUp.splice(0, this._playersBackUp.length);
    // Make a deep copy of players
    this._playersBackUp = players.map((player) =>
      JSON.parse(JSON.stringify(player))
    );
    // send shadows only if more than one player in game
    if (this._numberOfPlayers > 1) {
      emitInfoShadows(io, players);
    }
  }

  gameOver() {
    this._game.stopGame();
  }
}

export default Room;
