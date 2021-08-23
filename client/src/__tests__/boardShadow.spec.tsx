/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import BoardShadow from '../components/BoardShadow';
import configureStore from 'redux-mock-store';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow } from 'src/interfaces';

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component BoardShadow()', () => {
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
    isHost: false,
  });

  const component = render(
    <Provider store={store}>
      <BoardShadow />
    </Provider>
  );

  it('should test BoardShadow', () => {
    expect(component.asFragment());
  });
});
