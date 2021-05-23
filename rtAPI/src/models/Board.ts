import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/const';
import { IPiece } from '../interfaces/piece.interface';

export class Board {
  public shape: number[][];

  constructor() {
    this.shape = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    );
  }

  drawPiece(piece: IPiece) {
    piece.pos.forEach((pos) => {
      this.shape[pos.y][pos.x] = piece.color;
    });
  }

  cleanPiece(piece: IPiece) {
    piece.pos.forEach((pos) => {
      this.shape[pos.y][pos.x] = 0;
    });
  }
}
