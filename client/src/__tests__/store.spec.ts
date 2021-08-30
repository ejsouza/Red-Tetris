import { EMPTY_BOARD, EMPTY_PIECE } from '../utils/const';

import {
  resetStore,
  updateBoard,
  updatePiece,
  updateNextPiece,
  updateNext,
  updateShadows,
  updatePlayerShadow,
  updateScore,
  updateLevel,
  updateIsHost,
  updateUserLogged,
  reducer,
  initialState,
  initStore,
} from '../store/index';

import { IShadow, IUser } from '../interfaces';

describe('should test all store functions (nosense)', () => {
  const board = EMPTY_BOARD;
  const shadow: IShadow = {
    player: 'useEffect',
    board,
  };
  const user: IUser = {
    success: true,
    id: 'thisIsARandomId42',
    token: 'thisIsARandomToken42',
  };
  const piece = EMPTY_PIECE[0];

  it('should call resetStore()', () => {
    const rstStore = resetStore();
    expect(rstStore.type).toBe('PLAYER_RESET');
  });

  it('should call updateBoard()', () => {
    const brd = updateBoard(board);
    expect(brd.type).toBe('BOARD/UPDATED');
  });

  it('should call updatePiece()', () => {
    const p = updatePiece(piece);
    expect(p.type).toBe('PIECE/UPDATED');
  });

  it('should call updateNextPiece()', () => {
    const p = updateNextPiece(piece);
    expect(p.type).toBe('NEXT_PIECE/UPDATED');
  });

  it('should call updateNext()', () => {
    const next = updateNext([42]);
    expect(next.type).toBe('NEXT/UPDATED');
  });

  it('should call updateShadows()', () => {
    const update = updateShadows([shadow]);
    expect(update.type).toBe('SHADOWS/UPDATED');
  });

  it('should call updatePlayerShadow()', () => {
    const updateShadow = updatePlayerShadow(shadow);
    expect(updateShadow.type).toBe('PLAYER_SHADOW/UPDATED');
  });

  it('should call updateScore()', () => {
    const score = updateScore(42);
    expect(score.type).toBe('PLAYER_SCORE/UPDATED');
  });

  it('should call updateLevel()', () => {
    const lvl = updateLevel(42);
    expect(lvl.type).toBe('PLAYER_LEVEL/UPDATED');
  });

  it('should call updateIsHost()', () => {
    const isHost = updateIsHost(true);
    expect(isHost.type).toBe('PLAYER_IS_HOST/UPATED');
  });

  it('should call updateUserLogged()', () => {
    const usr = updateUserLogged(user);
    expect(usr.type).toBe('USER_LOGGED_UPDATED');
  });

  it('should call reducer(BOARD_UPDATED)', () => {
    const brd = updateBoard(board);
    const act = reducer(initialState, brd);
    expect(act.isHost).toBe(false);
  });

  it('should call reducer(PIECE_UPDATED)', () => {
    const p = updatePiece(piece);
    const act = reducer(initialState, p);
    expect(act.piece.height).toBe(0);
  });

  it('should call reducer(NEXT_PIECE_UPDATED)', () => {
    const nxt = updateNextPiece(piece);
    const act = reducer(initialState, nxt);
    expect(act.piece.height).toBe(0);
  });

  it('should call reducer(NEXT_UPDATED)', () => {
    const nxt = updateNext([42]);
    const act = reducer(initialState, nxt);
    expect(act.next[0]).toBe(42);
  });

  it('should call reducer(SHADOWS_UPDATED)', () => {
    const shadows = updateShadows([shadow]);
    const act = reducer(initialState, shadows);
    expect(act.shadows).toBeTruthy();
  });

  it('should call reducer(PLAYER_SHADOW_UPDATED)', () => {
    const player = updatePlayerShadow(shadow);
    const act = reducer(initialState, player);
    expect(act.shadows).toBeTruthy();
  });

  it('should call reducer(PLAYER_SCORE_UPDATED)', () => {
    const score = updateScore(42);
    const act = reducer(initialState, score);
    expect(act.score).toBe(42);
  });

  it('should call reducer(PLAYER_LEVEL_UPDATED)', () => {
    const lvl = updateLevel(42);
    const act = reducer(initialState, lvl);
    expect(act.level).toBe(42);
  });

  it('should call reducer(PLAYER_IS_GAME_HOST)', () => {
    const isHost = updateIsHost(true);
    const act = reducer(initialState, isHost);
    expect(act.isHost).toBe(true);
  });

  it('should call reducer(USER_LOGGED_UPDATED)', () => {
    const usr = updateUserLogged(user);
    const act = reducer(initialState, usr);
    expect(act.user.id).toBe('thisIsARandomId42');
  });

  it('should call reducer(USER_LOGGED_UPDATED)', () => {
    const store = resetStore();
    const act = reducer(initialState, store);
    expect(act).toBeTruthy();
  });

  it('should blah', () => {
    const store = initStore(initialState);
    expect(store).toBeTruthy();
  });

  // it('should call useStore()', () => {
  //   const store = useStore(initialState);

  //   console.log(`store := ${store}`);
  //   expect(store).toBeTruthy();
  // });
});
