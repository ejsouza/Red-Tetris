import * as socketIO from 'socket.io';
import { Board } from './Board';
import { Piece } from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import { BOARD_HEIGHT, BOARD_WIDTH, PIECES } from '../utils/const';

interface ClassIPiece {
  shape: number[][];
  drawPiece(piece: IPiece): void;
  cleanPiece(piece: IPiece): void;
}

export class Game {
  public socket: socketIO.Socket;
  public board: ClassIPiece;
  public piece: IPiece;
  public nextPiece: IPiece;
  public _piece: Piece;

  constructor(socket: socketIO.Socket) {
    this.socket = socket;
    this.board = new Board();
    this._piece = new Piece();
    // this.piece = new Piece().shape;
    // this.nextPiece = new Piece().shape;
    this.piece = this._piece.randomPiece();
    this.nextPiece = this._piece.randomPiece();
    this.start();
  }

  start = (): void => {
    this.initializeBoard();
    this.startGameInterval();
  };

  initializeBoard = (): void => {
    this.board.drawPiece(this.piece);
    this.socket.emit('newMap', this.board.shape, this.piece);
  };

  startGameInterval = (): void => {
    this.socket.on('keydown', (args) => {
      this.board.cleanPiece(this.piece);
      this.piece = args.piece;
      this.board.drawPiece(this.piece);
      this.socket.emit('gameState', this.board.shape, this.piece);
    });
    const interval = setInterval(() => {
      const winner = this.gameLoop();
      if (!winner) {
        this.socket.emit('gameState', this.board.shape, this.piece);
      } else {
        if (this.isGameOver()) {
          this.socket.emit('gameOver');
          clearInterval(interval);
        } else {
          /**
           * ATENTION 🚨
           * the value of this.piece has to be set  in this else
           * and cannot be moved elsewhere, like inside this.newPiece()
           */
          /**
           * DO NOT 👉 this.piece = this.nextPiece;
           * it will only copy the same reference and share the same address
           */
          this.nextPiece.pos.forEach((pos, index) => {
            this.piece.pos[index].y = pos.y;
            this.piece.pos[index].x = pos.x;
          });
          this.piece.color = this.nextPiece.color;
          this.piece.height = this.nextPiece.height;
          this.piece.width = this.nextPiece.width;
          /**
           * Even though is seems that the drawing should come before
           * it is not the case
           * it need to come after, otherwise piece will start on row 1
           * instead of row 0
           */
          this.board.drawPiece(this.piece);
          this.socket.emit('gameState', this.board.shape, this.piece);
          this.newPiece();
        }
      }
    }, (900 * 60) / 100);
  };

  newPiece = (): void => {
    // this.nextPiece = new Piece().shape;
    this.nextPiece = this._piece.randomPiece();
  };

  isNextXRowFree = (): boolean => {
    let isFree = true;
    this.board.cleanPiece(this.piece);
    this.piece.pos.forEach((pos) => {
      if (
        pos.y + 1 >= BOARD_HEIGHT ||
        this.board.shape[pos.y + 1][pos.x] !== 0
      ) {
        // console.log(`\n💥💥🔥🔥☄️☄️\n`);
        isFree = false;
        this.board.drawPiece(this.piece);
        return;
      }
    });
    return isFree;
  };

  gameLoop = (): boolean => {
    if (!this.isNextXRowFree()) {
      return true;
    }

    this.board.cleanPiece(this.piece);
    this.piece.pos.forEach((pos) => {
      pos.y++;
    });
    this.board.drawPiece(this.piece);
    return false;
  };

  isGameOver = (): boolean => {
    let gameOver = BOARD_HEIGHT;
    this.piece.pos.forEach((pos) => {
      if (pos.y < gameOver) {
        gameOver = pos.y;
      }
    });
    return gameOver < this.piece.height;
  };
}
