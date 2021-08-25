/**
 * @jest-environment jsdom
 */

import * as React from 'react';
// import SocketMock from 'socket.io-mock';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { InfoGame } from '../components/InfoGame';
import configureStore from 'redux-mock-store';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow } from 'src/interfaces';

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component InfoGame()', () => {
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
    isHost: false,
  });

  const component = render(
    <Provider store={store}>
      <InfoGame player="useEffect" game="React" />
    </Provider>
  );

  it('should test infoGame', () => {
    expect(component.asFragment());
  });
});
