// https://github.com/vercel/next.js/blob/canary/examples/with-redux/store.js
import { useMemo } from 'react';
import redux, { createStore, applyMiddleware, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IPiece, IBoard, IShadow } from '../interfaces/';

interface IInitialState {
  board: number[][];
  piece: IPiece;
  nextPiece: IPiece;
  shadows: IShadow[];
}

const boardInitialState: number[][] = [];

let store: redux.Store | undefined;

const initialState: IInitialState = {
  board: Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)),
  piece: EMPTY_PIECE[0],
  nextPiece: EMPTY_PIECE[0],
  shadows: [],
};

interface IBoardAction {
	type: string;
	payload?: number[][];
}

interface IPieceAction {
  type: string;
  payload?: IPiece;
}

interface IShadowAction {
	type: string;
	payload?: IShadow[];
}


const boardReducer = (state = boardInitialState, action: IBoardAction) => {
	switch (action.type) {
    case 'BOARD/UPDATED':
      return {
        ...state,
        board: action.payload,
      };
    default:
			return state
  }
}

const pieceReducer = (state = EMPTY_PIECE[0], action: IPieceAction) => {
		switch (action.type) {
      case 'PIECE/UPDATED':
        return {
          ...state,
          piece: action.payload,
        };
      default:
        return state;
    }
}

const nextPieceReducer = (state = [EMPTY_PIECE[0]], action: IPieceAction) => {
  switch (action.type) {
    case 'NEXT_PIECE/UPDATED':
      return {
        ...state,
        nextPiece: action.payload,
      };
    default:
      return state;
  }
};

const shadowsReducer = (state = [], action: IShadowAction) => {
  switch (action.type) {
    case 'SHADOWS/UPDATED':
      return {
        ...state,
        shadows: action.payload,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
	board: boardReducer,
	piece: pieceReducer,
	nextPiece: nextPieceReducer,
	shadows: shadowsReducer,
})

const configStore = configureStore({
  reducer: {
   rootReducer
  },
});

export type RootState = ReturnType<typeof configStore.getState>;

export type AppDispatch = typeof configStore.dispatch;

const initStore = (preloadedState = initialState) => {
  return createStore(
  	rootReducer,
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
