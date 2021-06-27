// https://github.com/vercel/next.js/blob/canary/examples/with-redux/store.js
import { useMemo } from 'react';
import redux, { createStore, applyMiddleware, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EMPTY_PIECE,
  BOARD_UPDATED,
  PIECE_UPDATED,
  NEXT_PIECE_UPDATED,
  SHADOWS_UPDATED,
} from '../utils/const';
import { IPiece, IBoard, IShadow } from '../interfaces/';

let store: redux.Store | undefined;

const intialShadows: IShadow[] = [];

const initialState = {
  board: <number[][]>(
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  ),
  piece: EMPTY_PIECE[0],
  nextPiece: EMPTY_PIECE[0],
  shadows: intialShadows,
};

const updateBoard = (board: number[][]) => {
  return <const>{
    type: BOARD_UPDATED,
    board,
  };
};

const updatePiece = (piece: IPiece) => {
  return <const>{
    type: PIECE_UPDATED,
    piece,
  };
};

const updateNextPiece = (nextPiece: IPiece) => {
  return <const>{
    type: NEXT_PIECE_UPDATED,
    nextPiece,
  };
};

const updateShadows = (shadows: IShadow[]) => {
  return <const>{
    type: SHADOWS_UPDATED,
    shadows,
  };
};

type ActionsType = ReturnType<
  | typeof updateBoard
  | typeof updatePiece
  | typeof updateNextPiece
  | typeof updateShadows
>;
type State = typeof initialState;
const reducer = (state = initialState, action: ActionsType): State => {
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
    case SHADOWS_UPDATED:
      {
        return {
          ...state,
          shadows: [...action.shadows],
        };
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

const initStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
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
