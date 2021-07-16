import { BaseURL } from '../utils/const';

const signup = async (email: string, password: string) => {
  return fetch(`${BaseURL}/auth/signup`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      email,
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
  return fetch(`${BaseURL}/${user.id}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })
    .then((response) => response)
    .catch((err) => {
      console.log(`CATCH ${err}`);
    });
};

export {
  signup,
  createNewToken,
  signin,
  logout,
  getCurrentUser,
  authHeader,
  getUserById,
};
