import { IPiece } from '../interfaces';
import {
  PIECE_UPDATED,
  NEXT_PIECE_UPDATED,
  BOARD_UPDATED,
} from '../utils/const';

const pieceUpdated = (piece: IPiece) => {
  return { type: PIECE_UPDATED, piece };
};

const nextPieceUpdated = (nextPiece: IPiece) => {
  return { type: NEXT_PIECE_UPDATED, nextPiece };
};

const boardUpdated = (board: number[][]) => {
  return { type: BOARD_UPDATED, board };
};
export { pieceUpdated, nextPieceUpdated, boardUpdated };
