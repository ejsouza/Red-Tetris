import Game from './Game';
import Player, { IPlayer } from './Player';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';

export interface IRoom {
  name: string;
  isOpen: boolean;
  gameHost: string;
  players: Player[];
  numberOfPlayers: number;
}

class Room {
  private _name: string;
  players: Player[];
  game: Game;
  private _isOpen: boolean;
  private _gameHost: string;
  numberOfPlayers: number;

  constructor(props: IRoom) {
    this._name = props.name;
    this.players = props.players;
    this._isOpen = props.isOpen;
    this._gameHost = props.gameHost;
    this.numberOfPlayers = props.numberOfPlayers;
  }

  get name() {
    return this._name;
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(open) {
    this._isOpen = open;
  }

  get gameHost() {
    return this._gameHost;
  }

  set gameHost(gameHost) {
    this._gameHost = gameHost;
  }

  set addGame(game: Game) {
    this.game = game;
  }

  addPlayer(player: IPlayer) {
    this.players.push(new Player(player));
    this.numberOfPlayers++;
    if (this.numberOfPlayers === MAX_NUMBER_OF_PLAYERS) {
      this.isOpen = false;
    }
  }

  removePlayer(playerName: string) {
    const isHost = this.players.filter((player) => player.name === playerName);
    if (isHost.length && isHost[0].isHost) {
      const newHost = this.players.filter(
        (player) => player.name !== playerName
      );
      /* Change host if any player left */
      if (newHost.length) {
        newHost[0].isHost = true;
        this._gameHost = newHost[0].name;
      }
    }

    /* Remove player that quited from array */
    const index = this.players.map((player) => player.name).indexOf(playerName);
    /**
     * (If negative, it will begin that many elements from the end of the array.)
     */
    if (index < 0) {
      return;
    }
    this.players.splice(index, 1);
  }
}

export default Room;
