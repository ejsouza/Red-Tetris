// https://github.com/vercel/next.js/blob/canary/examples/with-redux/store.js
import { useMemo } from 'react';
import redux, { createStore, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';

interface IActions {
  type: string;
  playload: string;
}

interface IInitialState {
  lastUpdate: number;
  light: boolean;
  count: number;
}

let store: redux.Store | undefined;

const initialState = {
  board: Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)),
  piece: EMPTY_PIECE[0],
  nextPiece: EMPTY_PIECE[0],
  shadows: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'BOARD/UPDATED':
      return {
        ...state,
        board: action.payload,
      };
    case 'PIECE':
      return {
        ...state,
        piece: action.piece,
      };
    case 'NEXT_PIECE':
      return {
        ...state,
        nextPiece: action.nextPiece,
      };
    case 'SHADOWS':
      return {
        ...state,
        shadows: action.shadows,
      };
    default:
      return state;
  }
};

const configStore = configureStore({
  reducer: {
    reducer: reducer,
  },
});

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
