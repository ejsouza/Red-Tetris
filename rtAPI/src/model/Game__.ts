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

  constructor(
    io: socketIO.Server,
    socket: socketIO.Socket,
    players: Player[],
    gameName: string
  ) {
    this._name = gameName;
    this._io = io;
    this._socket = socket;
    this._players = players;
    this._piece = new Piece();
    this.initializePieces();
    this.start();
  }

  initializePieces() {
    const piece = this._piece.randomPiece();
    const nextPiece = this._piece.randomPiece();

    this._players.forEach((player) => {
      console.log(`this.player? ${player.name}`);
      player.updatePiece = Object.create(piece);
      player.updateNextPiece = Object.create(nextPiece);
    });
  }

  get players() {
    return this._players;
  }

  start() {
    // const intervalId = setInterval(() => {
    const intervalId = setInterval(() => {
      this._socket.emit('gameUpdate', 'updating');
      GameController.updatePlayers(
        this._io,
        this._socket,
        this._players,
        this._name
      );
    }, (700 * 60) / 100);
    this._intervalId = intervalId;
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
