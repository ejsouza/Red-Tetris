import Board from './Board';
import Piece from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EMPTY_PIECE,
  BLOCKED_ROW,
  POINTS_FOR_ONE_LINE,
  POINTS_FOR_TWO_LINES,
  POINTS_FOR_THREE_LINES,
  POINTS_FOR_FOUR_LINES,
} from '../utils/const';
import { posix } from 'node:path';

class Player {
  name: string;
  socketId: string;
  board: Board;
  piece: IPiece;
  nextPiece: IPiece[];
  private _score: number;
  isHost: boolean;
  lost: boolean;
  private _winner: boolean;
  private _level: number;
  private _linesClered: number;

  constructor(name: string, socketId: string, isHost: boolean) {
    this.name = name;
    this.socketId = socketId;
    this.board = new Board();
    this._score = 0;
    this.lost = false;
    this._winner = false;
    this._level = 0;
    this._linesClered = 0;
    this.isHost = isHost;
    this.nextPiece = [];
  }

  /**
   * GETTERS & SETTERS
   */

  set updatePiece(piece: IPiece) {
    this.piece = JSON.parse(JSON.stringify(piece));
  }

  set updateNextPiece(piece: IPiece) {
    this.nextPiece.push(JSON.parse(JSON.stringify(piece)));
  }

  get showNextPiece() {
    return this.nextPiece[0];
  }

  get hasLost() {
    return this.lost;
  }

  set hasLost(lost: boolean) {
    this.lost = lost;
  }

  get hasWon() {
    return this._winner;
  }
  set hasWon(win: boolean) {
    this._winner = win;
  }

  get score() {
    return this._score;
  }
  //*********************************************************

  /**
   *  METHODS
   */
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
        // Draw piece here when false, otherwise it will be
        // drawn on the controller
        this.draw();
        fall = false;
        return false;
      }
    });
    // Don't draw() piece here, it will be done on controller
    return fall;
  }

  getNextPiece() {
    this.piece = this.nextPiece.shift();
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

  isMoveLeftAllowed(): boolean {
    let canMove = true;
    this.cleanPieceFromBoard();
    this.piece.pos.forEach((pos) => {
      if (
        pos.y < 2 ||
        pos.x - 1 < 0 ||
        this.board.shape[pos.y][pos.x - 1] !== 0
      ) {
        // if cannot move left draw piece to the same position
        this.draw();
        canMove = false;
        return false;
      }
    });
    // if canMove piece will be draw in moveLeft
    return canMove;
  }

  moveLeft(): boolean {
    if (this.isMoveLeftAllowed()) {
      /**
       * If we get here we don't  need to clean board
       * it was cleaned in isMoveLeftOk() and not draw back
       */
      this.pieceDecrementX();
      this.draw();
      return true;
    }
    return false;
  }

  isMoveRightAllowed(): boolean {
    let canMove = true;
    this.cleanPieceFromBoard();
    this.piece.pos.forEach((pos) => {
      if (
        pos.y < 2 ||
        pos.x + 1 === BOARD_WIDTH ||
        this.board.shape[pos.y][pos.x + 1] !== 0
      ) {
        // if cannot move right draw piece to the same position
        this.draw();
        canMove = false;
        return false;
      }
    });
    // if canMove piece will be draw in moveRight
    return canMove;
  }

  moveRight(): boolean {
    if (this.isMoveRightAllowed()) {
      /**
       * If we get here we don't  need to clean board
       * it was cleaned in isMoveLeftOk() and not draw back
       */
      this.pieceIncrementX();
      this.draw();
      return true;
    }
    return false;
  }

  isMoveDownAllowed(): boolean {
    let canMove = true;
    this.cleanPieceFromBoard();
    this.piece.pos.forEach((pos) => {
      if (
        pos.y + 1 === BOARD_HEIGHT ||
        this.board.shape[pos.y + 1][pos.x] !== 0
      ) {
        // if cannot move down draw piece to the same position
        this.draw();
        canMove = false;
        return false;
      }
    });
    // if canMove piece will be draw in moveDown
    return canMove;
  }

  moveDown(): boolean {
    if (this.isMoveDownAllowed()) {
      /**
       * If we get here we don't  need to clean board
       * it was cleaned in isMoveLeftOk() and not draw back
       */
      this.pieceIncrementY();
      this.draw();
      return true;
    }
    return false;
  }

  fall() {
    this.cleanPieceFromBoard();
    let allowed = true;
    while (allowed) {
      let increment = true;
      this.piece.pos.forEach((pos) => {
        if (
          pos.y + 1 === BOARD_HEIGHT ||
          this.board.shape[pos.y + 1][pos.x] !== 0
        ) {
          allowed = false;
          increment = false;
        }
      });
      if (increment) {
        this.pieceIncrementY();
      }
    }
    this.draw();
  }

  newPieceFitsInBoard = (piece: IPiece): boolean => {
    let fits = true;
    piece.pos.forEach((pos) => {
      if (
        pos.x < 0 ||
        pos.x >= BOARD_WIDTH ||
        // pos.y < 0 ||
        /**
         *  Board position 0 & 1 are not shown
         *  rotate piece should be at least on postion 2
         *  in the board otherwise it will look like the piece
         *  rotates outside of the board
         */
        pos.y < 2 ||
        pos.y >= BOARD_HEIGHT ||
        this.board.shape[pos.y][pos.x] !== 0
      ) {
        fits = false;
        return;
      }
    });
    return fits;
  };

  rotatePiece(): boolean {
    this.cleanPieceFromBoard();

    const rotatedPiece: IPiece = EMPTY_PIECE[0];
    const xLen: number[] = [];
    const yLen: number[] = [];
    rotatedPiece.color = this.piece.color;

    const pos =
      this.piece.height < this.piece.width
        ? this.piece.height
        : this.piece.width;
    const baseX = this.piece.pos[pos].x;
    const baseY = this.piece.pos[pos].y;
    /**
     * BASE ALGORITHM TO ROTATE PIECE
     *   clockwise         counter clockwise
     * 		[ 0   1 ]          [ 0  -1 ]
     *    [ -1  0 ]          [ 1   0 ]
     */
    this.piece.pos.forEach((pos, index) => {
      const newX = 0 * (pos.x - baseX) + 1 * (pos.y - baseY);
      const newY = -1 * (pos.x - baseX) + 0 * (pos.y - baseY);
      if (!xLen.includes(pos.x)) {
        xLen.push(pos.x);
      }
      if (!yLen.includes(pos.y)) {
        yLen.push(pos.y);
      }
      rotatedPiece.pos[index].x = baseX + newX;
      rotatedPiece.pos[index].y = baseY + newY;
    });
    rotatedPiece.height = xLen.length;
    rotatedPiece.width = yLen.length;

    let rotate = false;
    /** Check if after rotating pieces fits on board */
    if (this.newPieceFitsInBoard(rotatedPiece)) {
      rotatedPiece.pos.forEach((pos, index) => {
        this.piece.pos[index].x = pos.x;
        this.piece.pos[index].y = pos.y;
      });
      this.piece.height = rotatedPiece.height;
      this.piece.width = rotatedPiece.width;
      rotate = true;
    }
    this.draw();
    return rotate;
  }

  scores(): number {
    let min = BOARD_HEIGHT;
    let height = 0;
    let score = 0;

    this.piece.pos.forEach((pos) => {
      height = pos.y > height ? pos.y : height;
      min = pos.y < min ? pos.y : min;
    });

    while (height >= min) {
      let count = 0;

      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (this.board.shape[height][col] === BLOCKED_ROW) {
          break;
        }
        if (this.board.shape[height][col] !== 0) {
          count++;
        }
      }
      if (count === BOARD_WIDTH) {
        this.incrementLinesCleared();
        for (let col = 0; col < BOARD_WIDTH; col++) {
          this.board.shape[height][col] = 0;
        }
        for (let h = height; h > 0; h--) {
          for (let col = 0; col < BOARD_WIDTH; col++) {
            this.board.shape[h][col] = this.board.shape[h - 1][col];
          }
        }
        score++;
      } else {
        height--;
      }
    }
    // Return number fo rows scored for number of penalities for opponents
    if (score) {
      this.updateLevel();
      this.calculateScore(score);
    }
    return score;
  }

  private incrementLinesCleared(): void {
    this._linesClered++;
  }

  private updateLevel(): void {
    this._level = Math.floor(this._linesClered / 10);
  }

  // https://www.codewars.com/kata/5da9af1142d7910001815d32
  private calculateScore(score: number): void {
    let s = 0;
    if (score === 1) {
      s = (this._level + 1) * POINTS_FOR_ONE_LINE;
    } else if (score === 2) {
      s = (this._level + 1) * POINTS_FOR_TWO_LINES;
    } else if (score === 3) {
      s = (this._level + 1) * POINTS_FOR_THREE_LINES;
    } else {
      s = (this._level + 1) * POINTS_FOR_FOUR_LINES;
    }
    this.incrementScore(s);
  }

  private incrementScore(value: number): void {
    this._score += value;
  }

  penalty(): void {
    let row = BOARD_HEIGHT - 1;

    while (row > 0 && this.board.shape[row][0] === BLOCKED_ROW) {
      row--;
    }

    for (let col = 0; col < BOARD_WIDTH; col++) {
      this.board.shape[row][col] = BLOCKED_ROW;
    }
  }
}

export default Player;
