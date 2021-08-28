/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import SignIn from '../components/SignIn';
import { BOARD_HEIGHT, BOARD_WIDTH, EMPTY_PIECE } from '../utils/const';
import { IShadow, IUser } from '../interfaces';
import { Mouse } from 'react-bootstrap-icons';

const initialUser: IUser = {
  success: false,
  id: 'randomId42',
  token: 'qwertyuiopasdfghjklzxcvbnm123456789',
};

const intialShadows: IShadow[] = [];
const initialNext: number[] = [];
let mockStore = configureStore([]);

describe('Component SignIn()', () => {
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

  it('should match Sign-in', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    expect(getByText('Sign-in')).toBeInTheDocument();
  });

  it('should click Sign-in', () => {
    const component = render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );

    fireEvent(
      component.getByText('Sign-in'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(component.getByText('Login')).toBeInTheDocument();
  });

  it('should click Login', () => {
    const component = render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );

    fireEvent(
      component.getByText('Sign-in'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    fireEvent(
      component.getByText('Login'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(component.getByText('Password')).toBeInTheDocument();
  });
});
