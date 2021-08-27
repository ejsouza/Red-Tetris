/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import NewGame from '../components/NewGame';
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

describe('Component NewGame()', () => {
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

  it('should match New Game', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NewGame />
      </Provider>
    );
    expect(getByText('New Game')).toBeInTheDocument();
  });
});
