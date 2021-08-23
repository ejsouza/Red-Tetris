import { EMPTY_BOARD, EMPTY_PIECE } from '../utils/const';

import {
  pieceUpdated,
  nextPieceUpdated,
  nextUpdated,
  boardUpdated,
  boardShadowsUpdated,
  boardPlayerShadowUpdated,
  scoreUpdated,
  levelUpdated,
  resetStore,
  isHostUpdated,
  userLoggetdUpdated,
} from '../store/actions';

import { IShadow, IUser } from '../interfaces/index';

describe('should test all actions', () => {
  const user: IUser = {
    success: true,
    id: 'thisIsARandomId42',
    token: 'thisIsARandomToken42',
  };
  const board = EMPTY_BOARD;
  const piece = EMPTY_PIECE[0];
  const shadow: IShadow = {
    player: 'useEffect',
    board,
  };
  it('should call resetStore()', () => {
    const rStore = resetStore();
    expect(rStore.type).toBe('PLAYER_RESET');
  });

  it('should call pieceUpdated()', () => {
    const pUpdated = pieceUpdated(piece);
    expect(pUpdated.type).toBe('PIECE/UPDATED');
  });

  it('should call nextPieceUpdated()', () => {
    const nxtPieceUpdated = nextPieceUpdated(piece);
    expect(nxtPieceUpdated.type).toBe('NEXT_PIECE/UPDATED');
  });

  it('should call nextUpdated()', () => {
    const nxtUpdated = nextUpdated([1]);
    expect(nxtUpdated.type).toBe('NEXT/UPDATED');
  });

  it('should call boardUpdated()', () => {
    const brdUpdated = boardUpdated(board);
    expect(brdUpdated.type).toBe('BOARD/UPDATED');
  });

  it('should call boardShadowsUpdated()', () => {
    const brdShadowsUpdated = boardShadowsUpdated([shadow]);
    expect(brdShadowsUpdated.type).toBe('SHADOWS/UPDATED');
  });

  it('should call boardPlayerShadowUpdated()', () => {
    const brdPlayerShadowUpdated = boardPlayerShadowUpdated(shadow);
    expect(brdPlayerShadowUpdated.type).toBe('PLAYER_SHADOW/UPDATED');
  });

  it('should call scoreUpdated()', () => {
    const score = scoreUpdated(42);
    expect(score.type).toBe('PLAYER_SCORE/UPDATED');
  });

  it('should call levelUpdated()', () => {
    const lvl = levelUpdated(42);
    expect(lvl.type).toBe('PLAYER_LEVEL/UPDATED');
  });

  it('should call isHostUpdated()', () => {
    const isHost = isHostUpdated(true);
    expect(isHost.type).toBe('PLAYER_IS_HOST/UPATED');
  });

  it('should call userLoggedUpdated()', () => {
    const usr = userLoggetdUpdated(user);
    expect(usr.type).toBe('USER_LOGGED_UPDATED');
  });
});
