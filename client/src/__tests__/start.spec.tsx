/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import Start from '../components/Start';
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

describe('Component Start()', () => {
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

  it('should match Start Game', () => {
    const component = render(
      <Provider store={store}>
        <Start gameName="React" playerName="useEffect" />
      </Provider>
    );
    expect(component.asFragment());
  });
});
