import * as dotenv from 'dotenv';
// import { BaseURL } from '../utils/const';

dotenv.config();

const test = process.env.NODE_ENV === 'test';
const BaseURL = test
  ? 'http://server_tests:8000/api/v1'
  : 'http://localhost:8000/api/v1';

// const apiURL = 'http://localhost:8000/api/v1';

const signup = async (email: string, password: string) => {
  return fetch(`${BaseURL}/auth/signup`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((response) => response);
};

const signin = async (email: string, password: string) => {
  return fetch(`${BaseURL}/auth/signin`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((response) => response);
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    /**
     * Typescript complains about possible null user
     * that's why this return is wrapped in a if statement
     * in case user is null we return null any way at the end
     */
    return JSON.parse(user);
  }
  return user;
};

const createNewToken = async (email: string) => {
  return fetch(`${BaseURL}/token/create`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then((response) => response);
};

const authHeader = () => {
  const currentUser = localStorage.getItem('user');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    if (user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
  }
  return {};
};

const getUserById = async () => {
  const user = getCurrentUser();
  return fetch(`${BaseURL}/users/${user?.id}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err);
};

const updateProfile = async (firstName: string, lastName: string) => {
  const user = getCurrentUser();
  return fetch(`${BaseURL}/users/${user?.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
    body: JSON.stringify({
      firstName,
      lastName,
    }),
  })
    .then((response) => response)
    .catch((err) => err);
};

const updateScore = async (
  score: number,
  level: number,
  multiplayer: number,
  victory: boolean,
  defeat: boolean
) => {
  const user = getCurrentUser();
  if (!user) {
    /**
     * If user is undefined do nothing
     * no account to update,
     */
    return;
  }
  fetch(`${BaseURL}/users/${user?.id}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
    body: JSON.stringify({
      level,
      score,
      defeat: defeat && multiplayer > 1 ? 1 : 0,
      victory: victory && multiplayer > 1 ? 1 : 0,
      playedGames: 1,
    }),
  }).then((response) => response);
};

const changePassword = async (email: string, password: string) => {
  return fetch(`${BaseURL}/password/reset`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((response) => response);
};

export {
  signup,
  createNewToken,
  signin,
  logout,
  getCurrentUser,
  authHeader,
  getUserById,
  updateProfile,
  updateScore,
  changePassword,
};
