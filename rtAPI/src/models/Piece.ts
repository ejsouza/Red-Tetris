import { PIECES } from '../utils/const';
import { IPiece } from '../interfaces/piece.interface';

export class Piece {
  public shape: IPiece;
  private _pieces: number[];

  constructor() {
    // this.shape = PIECES[Math.floor(Math.random() * 7)];
		this._pieces = [];
    // this.shape = this.randomPiece();
  }
  randomPiece = (): IPiece => {
    if (this._pieces.length === 0) {
      console.log('Create a new random full piece');
      this._pieces = [
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6,
      ];
    }
    console.log('new piece requested\n');
		return PIECES[
      this._pieces.splice(
        Math.floor(Math.random() * this._pieces.length),
        1
      )[0]
    ];
  };
}
