import { IPiece } from '../interfaces/piece.interface';
import Board from './Board';
import Piece from './Piece';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../utils/const';

export interface IPlayer {
  name: string;
  id: string;
  isHost: boolean;
  roomName: string;
}

class Player {
  name: string;
  id: string;
  score: number;
  private _isHost: boolean;
  inGame: boolean;
  private _hasLost: boolean;
  private _gameLostAt: number;
  roomName: string;
  private _piece: Piece;
  nextPiece: number[];
  board: Board;

  constructor(args: IPlayer) {
    this.name = args.name;
    this.id = args.id;
    this.score = 0;
    this._isHost = args.isHost;
    this.inGame = true;
    this._hasLost = false;
    this._gameLostAt = 0;
    this.roomName = args.roomName;
    this.board = new Board();
    this.nextPiece = [];
  }

  set piece(piece: Piece) {
    this._piece = piece;
  }

  get piece() {
    return this._piece;
  }

  set boardShape(shape: number[][]) {
    this.board.shape = shape;
  }

  get lost() {
    return this._hasLost;
  }

  set lost(playerLost: boolean) {
    this._hasLost = playerLost;
  }

  get gameLostAt() {
    return this._gameLostAt;
  }

  set gameLostAt(time: number) {
    this._gameLostAt = time;
  }

  get isHost() {
    return this._isHost;
  }

  set isHost(is: boolean) {
    this._isHost = is;
  }

  resetBoard() {
    this.lost = false;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.board.shape[row][col] = 0;
      }
    }
  }

  isThirdRowReached() {
    let found = false;
    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (this.board.shape[2][col] !== 0) {
        found = true;
        break;
      }
    }
    return found;
  }

  toObject() {
    const state = {
      at: Date.now(),
      piece: JSON.parse(JSON.stringify(this._piece.shape)),
      score: this.score,
      nextPiece: [...this.nextPiece],
    };
    return state;
  }

  appendNextPiece(arr: number[]) {
    this.nextPiece.push(...arr);
  }
}

export default Player;
