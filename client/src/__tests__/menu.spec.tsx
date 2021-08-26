/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Menu from '../components/Menu';
import configureStore from 'redux-mock-store';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow } from '../interfaces';

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component Menu()', () => {
  let store = mockStore({
    board: Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    ),
    piece: EMPTY_PIECE[0],
    nextPiece: EMPTY_PIECE[0],
    next: initialNext,
    shadows: intialShadows,
    score: 0,
    level: 0,
    isHost: true,
  });

  it('should match Sign-in', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );
    expect(getByText('Sign-in')).toBeInTheDocument();
  });

  it('should match Sign-up', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );
    expect(getByText('Sign-up')).toBeInTheDocument();
  });
  it('should match New Game', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );
    expect(getByText('New Game')).toBeInTheDocument();
  });
});
