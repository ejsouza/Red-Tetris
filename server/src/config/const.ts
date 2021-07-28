const BaseURL = '/api/v1';
const TEST_BASE_URL = 'http://localhost:8000/api/v1';
export const FRONT_URL: string = 'http://localhost:3000';

const MAX_NUMBER_OF_PLAYERS = 4;

const SALT_ROUNDS = 10;

const SECRET_TOKEN = 'thisIsASecreatToken';

const emailCheck =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const PASS_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

export {
  BaseURL,
  SALT_ROUNDS,
  MAX_NUMBER_OF_PLAYERS,
  SECRET_TOKEN,
  emailCheck,
  PASS_REGEX,
  TEST_BASE_URL,
};
