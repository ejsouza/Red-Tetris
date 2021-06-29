import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';

interface IRoom {
  name: string;
  players: [
    {
      name: string;
      socketId: string;
    }
  ];
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
  private _players: IPlayer;
  private _numberOfPlayers: number;
  private _host: string;
  private _open: boolean;

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
    this._players.push(player);
    this._numberOfPlayers++;
    if (this._numberOfPlayers === MAX_NUMBER_OF_PLAYERS) {
      this.open = false;
    }
  }
}

export default Room;
