import * as socketIO from 'socket.io';
import { Board } from './Board';
import { Piece } from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../utils/const';

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

  constructor(socket: socketIO.Socket) {
    this.socket = socket;
    this.board = new Board();
    this.start();
  }

  start = (): void => {
    this.initializeBoard();
    this.startGameInterval();
  };

  initializeBoard = (): void => {
    const piece = new Piece();
    const nextPiece = new Piece();
    this.piece = piece.shape;
    this.nextPiece = nextPiece.shape;
    this.board.drawPiece(piece.shape);
    this.socket.emit('newMap', this.board.shape, this.piece);
  };

  startGameInterval = (): void => {
    const interval = setInterval(() => {
      const winner = this.gameLoop();
      if (!winner) {
        this.socket.emit('gameState', this.board.shape, this.piece);
      } else {
        const isGameOver = this.isGameOver();
        if (isGameOver) {
          this.socket.emit('gameOver');
          clearInterval(interval);
        } else {
          this.piece = this.nextPiece;
          this.socket.emit('gameState', this.board.shape, this.piece);
          const newPiece = new Piece();
          this.nextPiece = newPiece.shape;
        }
      }
    }, 1000);
  };

  isNextXRowFree = (): boolean => {
    let isFree = true;
    this.board.cleanPiece(this.piece);
    this.piece.pos.forEach((pos) => {
      if (
        pos.x + 1 >= BOARD_HEIGHT ||
        this.board.shape[pos.x + 1][pos.y] !== 0
      ) {
        isFree = false;
        this.board.drawPiece(this.piece);
        return;
      }
    });
    return isFree;
  };

  gameLoop = (): boolean => {
    if (!this.isNextXRowFree()) {
      console.log('!this.isNextXRowFree()');
      this.piece.pos.forEach((pos) => {
        console.log(`[${pos.x}][${pos.y}]`);
      });
      return true;
    }

    this.board.cleanPiece(this.piece);
    this.piece.pos.forEach((pos) => {
      pos.x++;
    });
    this.board.drawPiece(this.piece);
    return false;
  };

  isGameOver = (): boolean => {
    return false;
    let gameOver = BOARD_HEIGHT;
    this.piece.pos.forEach((pos) => {
      if (pos.x < gameOver) {
        gameOver = pos.x;
      }
    });
    console.log(`is x in the begining? ${gameOver} `);
    return gameOver === 0;
  };
}
