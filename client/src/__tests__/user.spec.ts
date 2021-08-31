/**
 * @jest-environment jsdom
 */

import 'isomorphic-fetch';
import {
  signup,
  signin,
  updateScore,
  createNewToken,
  authHeader,
  getUserById,
  updateProfile,
  changePassword,
  logout,
} from '../core/user';

describe('should test all user fucntions', () => {
  it('should call signup()', async () => {
    const data = await signup('testing@gmail.com', '123456');
    expect(data.status).toBe(400);
  });

  it('should call sigin()', async () => {
    const data = await signin('testing@gmail.com', '123456');
    expect(data.status).toBe(401);
  });

  it('should call updateScore()', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    const user = updateScore(42, 2, 1, true, false);
    expect(user).toBeTruthy();
  });

  it('should call createNewToken()', async () => {
    const token = await createNewToken('hello@gmail.com');
    expect(token).toBeTruthy();
  });

  it('should call authHeader()', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    const token = authHeader();
    expect(token).toBeTruthy();
  });

  it('should call getUserById()', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    const usr = await getUserById();
    expect(usr).toBeTruthy();
  });

  it('should call updateProfile()', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    const usr = await updateProfile('Falling', 'In Reverse');
    expect(usr).toBeTruthy();
  });

  it('should call changePassword()', async () => {
    const usr = await changePassword('zombie@gmail.com', 'badWolves');
    expect(usr).toBeTruthy();
  });

  it('should call logout()', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    logout();
  });
});
