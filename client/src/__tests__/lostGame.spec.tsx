/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import SocketMock from 'socket.io-mock';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import LostGame from '../components/LostGame';
import configureStore from 'redux-mock-store';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow } from '../interfaces';

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component LostGame()', () => {
  // it('test event emiting', () => {
  //   let socket = new SocketMock();

  //   socket.on('message', (message: string) => {
  //     expect(message).toBe('Hello World!');
  //   });

  //   socket.socketClient.emit('message', 'Helo World!');
  // });

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

  const component = render(
    <Provider store={store}>
      <LostGame player="useEffect" game="React" gameOver={false} />
    </Provider>
  );
  let socket = new SocketMock();
  socket.socketClient.emit('game-is-over');

  it('should match text', () => {
    expect(component.getByText('Quit ❌')).toBeInTheDocument();
  });
});
