import socket from '../socket';
import { IPiece } from '../../interfaces';

export interface IState {
  playerName: string;
  gameName: string;
  board: number[][];
  piece: IPiece;
  next: number[];
  score: number;
  at: number;
}
const emitFrontState = (state: IState) => {
  socket.emit('front-state', state);
};

const emitStatePieceUpdated = (piece: IPiece, next: number) => {
  const state = {
    piece,
    next,
    at: Date.now(),
  };
  socket.emit('front-state-update-piece', state);
};

export { emitFrontState, emitStatePieceUpdated };
