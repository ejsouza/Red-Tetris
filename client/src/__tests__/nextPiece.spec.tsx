/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import NextPiece from '../components/NextPiece';
import configureStore from 'redux-mock-store';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow } from '../interfaces';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      number: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component NextPiece()', () => {
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
      <NextPiece />
    </Provider>
  );

  it('should test NextPiece', () => {
    expect(component.asFragment());
  });
});
