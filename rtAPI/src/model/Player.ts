import Board from './Board';
import Piece from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../utils/const';

class Player {
  name: string;
  socketId: string;
  board: Board;
  piece: IPiece;
  nextPiece: IPiece[];
  score: number;
  isHost: boolean;
  lost: boolean;

  constructor(name: string, socketId: string, isHost: boolean) {
    this.name = name;
    this.socketId = socketId;
    this.board = new Board();
    this.score = 0;
    this.lost = false;
    this.isHost = isHost;
    // this.piece = EMPTY_PIECE[0];
    // this.nextPiece = [EMPTY_PIECE[0]];
  }

  set updatePiece(piece: IPiece) {
    this.piece = piece;
  }

  set updateNextPiece(piece: IPiece) {
    this.nextPiece = [piece];
  }

  cleanPieceFromBoard() {
    this.piece.pos.forEach((pos) => {
      this.board.shape[pos.y][pos.x] = 0;
    });
  }

  draw() {
    this.piece.pos.forEach((pos) => {
      this.board.shape[pos.y][pos.x] = this.piece.color;
    });
  }

  pieceCanFall(): boolean {
    let fall = true;
    this.cleanPieceFromBoard();
    this.piece.pos.forEach((pos) => {
      if (
        pos.y + 1 === BOARD_HEIGHT ||
        this.board.shape[pos.y + 1][pos.x] !== 0
      ) {
        fall = false;
        return false;
      }
    });
    this.draw();
    return fall;
  }

  pieceIncrementY() {
    this.piece.pos.forEach((pos) => pos.y++);
  }

  pieceIncrementX() {
    this.piece.pos.forEach((pos) => pos.x++);
  }

  pieceDecrementX() {
    this.piece.pos.forEach((pos) => pos.x--);
  }

  isGameOver(): boolean {
    let gameOver = 0;
    this.piece.pos.forEach((pos) => (gameOver = pos.y));
    return gameOver < 2;
  }
}

export default Player;
