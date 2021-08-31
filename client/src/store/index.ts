// https://github.com/vercel/next.js/blob/canary/examples/with-redux/store.js
import { useMemo } from 'react';
import redux, { createStore, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EMPTY_PIECE,
  BOARD_UPDATED,
  PIECE_UPDATED,
  NEXT_PIECE_UPDATED,
  NEXT_UPDATED,
  SHADOWS_UPDATED,
  PLAYER_SHADOW_UPDATED,
  PLAYER_SCORE_UPDATED,
  PLAYER_LEVEL_UPDATED,
  PLAYER_IS_GAME_HOST,
  STORE_RESET,
  USER_LOGGED_UPDATED,
} from '../utils/const';
import { IPiece, IBoard, IShadow, IUser } from '../interfaces/';

let store: redux.Store | undefined;

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
const initialUser: IUser = {
  success: false,
  id: '',
  token: '',
};

export const initialState = {
  board: <number[][]>(
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  ),
  piece: EMPTY_PIECE[0],
  nextPiece: EMPTY_PIECE[0],
  next: initialNext,
  shadows: intialShadows,
  score: 0,
  level: 0,
  isHost: false,
  user: initialUser,
};

export const resetStore = () => {
  return <const>{
    type: STORE_RESET,
  };
};
export const updateBoard = (board: number[][]) => {
  return <const>{
    type: BOARD_UPDATED,
    board,
  };
};

export const updatePiece = (piece: IPiece) => {
  return <const>{
    type: PIECE_UPDATED,
    piece,
  };
};

export const updateNextPiece = (nextPiece: IPiece) => {
  return <const>{
    type: NEXT_PIECE_UPDATED,
    nextPiece,
  };
};

export const updateNext = (next: number[]) => {
  return <const>{
    type: NEXT_UPDATED,
    next,
  };
};

export const updateShadows = (shadows: IShadow[]) => {
  return <const>{
    type: SHADOWS_UPDATED,
    shadows,
  };
};

export const updatePlayerShadow = (player: IShadow) => {
  return <const>{
    type: PLAYER_SHADOW_UPDATED,
    player,
  };
};

export const updateScore = (score: number) => {
  return <const>{
    type: PLAYER_SCORE_UPDATED,
    score,
  };
};

export const updateLevel = (level: number) => {
  return <const>{
    type: PLAYER_LEVEL_UPDATED,
    level,
  };
};

export const updateIsHost = (isHost: boolean) => {
  return <const>{
    type: PLAYER_IS_GAME_HOST,
    isHost,
  };
};

export const updateUserLogged = (user: IUser) => {
  return <const>{
    type: USER_LOGGED_UPDATED,
    user,
  };
};

export type ActionsType = ReturnType<
  | typeof updateBoard
  | typeof updatePiece
  | typeof updateNextPiece
  | typeof updateNext
  | typeof updateShadows
  | typeof updatePlayerShadow
  | typeof updateScore
  | typeof updateLevel
  | typeof updateIsHost
  | typeof resetStore
  | typeof updateUserLogged
>;
export type State = typeof initialState;
export const reducer = (state = initialState, action: ActionsType): State => {
  switch (action.type) {
    case BOARD_UPDATED:
      return {
        ...state,
        board: action.board,
      };
    case PIECE_UPDATED:
      return {
        ...state,
        piece: action.piece,
      };
    case NEXT_PIECE_UPDATED:
      return {
        ...state,
        nextPiece: action.nextPiece,
      };
    case NEXT_UPDATED:
      return {
        ...state,
        next: [...action.next],
      };
    case PLAYER_SHADOW_UPDATED:
      return {
        ...state,
        shadows: state.shadows.map((player) =>
          player.player === action.player.player
            ? { ...player, board: [...action.player.board] }
            : player
        ),
      };
    case SHADOWS_UPDATED: {
      return {
        ...state,
        shadows: [...action.shadows],
      };
    }
    case PLAYER_SCORE_UPDATED: {
      return {
        ...state,
        score: action.score,
      };
    }
    case PLAYER_LEVEL_UPDATED: {
      return {
        ...state,
        level: action.level,
      };
    }
    case PLAYER_IS_GAME_HOST: {
      return {
        ...state,
        isHost: action.isHost,
      };
    }
    case USER_LOGGED_UPDATED: {
      return {
        ...state,
        user: action.user,
      };
    }
    case STORE_RESET: {
      return initialState;
    }

    default:
      return state;
  }
};

const configStore = configureStore({
  reducer: reducer,
});

export type RootState = ReturnType<typeof configStore.getState>;

export type AppDispatch = typeof configStore.dispatch;

export const initStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk))
  );
};

export const initializeStore = (preloadedState: typeof initialState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }
  // Create the store once in the client
  if (!store) {
    store = <redux.Store>_store;
  }

  return _store;
};

export const useStore = (initialstate: typeof initialState) => {
  const store = useMemo(() => initializeStore(initialstate), [initialstate]);
  return store;
};
