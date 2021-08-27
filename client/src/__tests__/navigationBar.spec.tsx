/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import NavigationBar from '../components/NavigationBar';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow, IUser } from '../interfaces';

const initialUser: IUser = {
  success: false,
  id: 'randomId42',
  token: 'qwertyuiopasdfghjklzxcvbnm123456789',
};

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component NavigationBar()', () => {
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
    user: initialUser,
  });

  it('should match Red', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationBar />
      </Provider>
    );
    expect(getByText('Red')).toBeInTheDocument();
  });

  it('should match Tetris', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationBar />
      </Provider>
    );
    expect(getByText('Tetris')).toBeInTheDocument();
  });
});