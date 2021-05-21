import { PIECES } from '../utils/const';
import { IPiece } from '../interfaces/piece.interface';

export class Piece {
  public shape: IPiece;

  constructor() {
    this.shape = PIECES[Math.floor(Math.random() * 7)];
  }
}
