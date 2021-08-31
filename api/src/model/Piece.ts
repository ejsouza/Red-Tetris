import { PIECES } from '../utils/const';
import { IPiece } from '../interfaces/piece.interface';

class Piece {
  shape: IPiece;
  constructor(index: number) {
    this.shape = PIECES[index];
  }

  incrementY() {
    this.shape?.pos?.forEach((pos) => pos.y++);
  }

  incrementX() {
    this.shape?.pos?.forEach((pos) => pos.x++);
  }

  decrementX() {
    this.shape?.pos?.forEach((pos) => pos.x--);
  }

  lastPosition() {
    return this.shape?.pos[this.shape.height - 1].y;
  }

  get pieceShape() {
    return this.shape;
  }

  randomizer() {
    let base = [
      0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6,
      6, 6, 6,
    ];
    let random: number[];
    random = [];
    while (base.length) {
      random.push(base.splice(Math.floor(Math.random() * base.length), 1)[0]);
    }
    return random;
  }
}

export default Piece;
