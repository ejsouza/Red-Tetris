/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Game from '../components/Game';
import SocketMock from 'socket.io-mock';
import configureStore from 'redux-mock-store';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow } from 'src/interfaces';
import socket from '../utils/socket';

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component Game()', () => {
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
  beforeAll(() => {
    socket.open();
  });

  afterAll(() => {
    socket.close();
  });

  const component = render(
    <Provider store={store}>
      <Game gameName="React" playerName="useEffect" hardness={1} />
    </Provider>
  );

  it('should test Game', () => {
    let socket = new SocketMock();
    socket.socketClient.emit('youLost', { gameOver: true, multiplayer: 1 });
    expect(component.asFragment());
  });
});
