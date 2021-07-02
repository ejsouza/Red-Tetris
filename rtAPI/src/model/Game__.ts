import * as socketIO from 'socket.io';
import Player from './Player';
import Piece from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import * as GameController from '../controller/GameController';

type IPlayer = [
  {
    name: string;
    socketId: string;
  }
];

class Game__ {
  private _io: socketIO.Server;
  private _socket: socketIO.Socket;
  private _name: string;
  private _players: Player[];
  private _piece: Piece;
  private _intervalId: NodeJS.Timeout;
  private _interval: number;

  constructor(
    io: socketIO.Server,
    socket: socketIO.Socket,
    players: Player[],
    gameName: string,
    speed: number,
  ) {
    this._name = gameName;
    this._io = io;
    this._socket = socket;
    this._players = players;
    this._piece = new Piece();
    this._interval = speed;
    this.initializePieces();
    this.start();
  }

  initializePieces() {
    const piece = this._piece.randomPiece();
    const nextPiece = this._piece.randomPiece();
    /**
     *  Add a second piece to nextPiece[] to make sure
     *  all players have the same pieces
     */
    const thirdPiece = this._piece.randomPiece();

    this._players.forEach((player) => {
      player.updatePiece = piece;
      player.updateNextPiece = nextPiece;
      player.updateNextPiece = thirdPiece;
    });
  }

  get players() {
    return this._players;
  }

  start() {
    const intervalId = setInterval(() => {
      this._socket.emit('gameUpdate', 'updating');
      GameController.updatePlayers(
        this._io,
        this._socket,
        this._players,
        this._name,
        this._piece
      );
    }, this._interval);
    this._intervalId = intervalId;
  }

  removePlayer(playerName: string) {
    const index = this._players.findIndex(
      (player) => player.name === playerName
    );
    const removed = this._players.splice(index, 1);
    console.log(`user was removed from game => ${removed}`);
  }

  addNextPieceToQueu() {
    const nextPiece = this._piece.randomPiece();
    this._players.forEach((player) => player.nextPiece.push(nextPiece));
  }

  stopGame() {
    clearInterval(this._intervalId);
  }
}

export default Game__;
