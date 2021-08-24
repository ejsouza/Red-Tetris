import { IState, emitFrontState, emitStatePieceUpdated } from '../utils/emiter';
import { EMPTY_BOARD, EMPTY_PIECE } from '../utils/const';
import socket from '../utils/socket';

describe('should test all emiter', () => {
  const state: IState = {
    playerName: 'useEffect',
    gameName: 'React',
    board: EMPTY_BOARD,
    piece: EMPTY_PIECE[0],
    next: [42],
    score: 42,
    at: 42,
  };

  afterAll(() => {
    socket.close();
  });

  it('should call emitFrontState()', () => {
    emitFrontState(state);
  });

  it('should call emitStatePieceUpdated()', () => {
    const piece = EMPTY_PIECE[0];
    emitStatePieceUpdated(piece, 42);
  });
});
