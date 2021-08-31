export const BaseURL: string = 'http://localhost:8000/api/v1';
export const BASEurl: string = 'http://localhost:8000';
export const RT_API: string = 'http://localhost:5000';

const BOARD_HEIGHT = 22;
const BOARD_WIDTH = 10;
const BLOCKED_ROW = 8;
const MIN_PIECES = 8;

const PIECES = [
  {
    pos: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    width: 2,
    height: 2,
    color: 1,
    still: false,
  },
  {
    pos: [
      { x: 4, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    width: 3,
    height: 2,
    color: 2,
    still: false,
  },
  {
    pos: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    width: 3,
    height: 2,
    color: 3,
    still: false,
  },
  {
    pos: [
      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 4, y: 1 },
      { x: 3, y: 1 },
    ],
    width: 3,
    height: 2,
    color: 4,
    still: false,
  },
  {
    pos: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 3, y: 1 },
    ],
    width: 3,
    height: 2,
    color: 5,
    still: false,
  },
  {
    pos: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ],
    width: 3,
    height: 2,
    color: 6,
    still: false,
  },
  {
    pos: [
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ],
    width: 4,
    height: 1,
    color: 7,
    still: false,
  },
];

const EMPTY_PIECE = [
  {
    pos: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    width: 0,
    height: 0,
    color: 0,
    still: false,
  },
];

export interface IPiece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
  still: boolean;
}

export interface IBoard {
  board: number[][];
}

const COLORS_WITH_WHITE = [
  '#FFFFFF',
  '#ECF00B',
  '#8C00EC',
  '#1100EC',
  '#EB8E08',
  '#45F304',
  '#E90005',
  '#48EFEC',
  '#FC03db',
];

const BOARD_COLORS = [
  '',
  '#ECF00B',
  '#8C00EC',
  '#1100EC',
  '#EB8E08',
  '#45F304',
  '#E90005',
  '#48EFEC',
  '#FC03DB',
];

const SHADOW_COLORS = ['', '', '', '', '', '', '', '', '', '#CF0ED2'];

const BOARD_UPDATED = 'BOARD/UPDATED';
const PIECE_UPDATED = 'PIECE/UPDATED';
const NEXT_PIECE_UPDATED = 'NEXT_PIECE/UPDATED';
const NEXT_UPDATED = 'NEXT/UPDATED';
const SHADOWS_UPDATED = 'SHADOWS/UPDATED';
const PLAYER_SHADOW_UPDATED = 'PLAYER_SHADOW/UPDATED';
const PLAYER_SCORE_UPDATED = 'PLAYER_SCORE/UPDATED';
const PLAYER_LEVEL_UPDATED = 'PLAYER_LEVEL/UPDATED';
const PLAYER_IS_GAME_HOST = 'PLAYER_IS_HOST/UPATED';
const STORE_RESET = 'PLAYER_RESET';
const USER_LOGGED_UPDATED = 'USER_LOGGED_UPDATED';

const KEY_ARROW_LEFT_PRESSED = 'ArrowLeft';
const KEY_ARROW_RIGHT_PRESSED = 'ArrowRight';
const KEY_ARROW_DOWN_PRESSED = 'ArrowDown';
const KEY_ARROW_UP_PRESSED = 'ArrowUp';
const KEY_ARROW_SPACE_PRESSED = ' ';

const POINTS_FOR_ONE_LINE = 40;
const POINTS_FOR_TWO_LINES = 100;
const POINTS_FOR_THREE_LINES = 300;
const POINTS_FOR_FOUR_LINES = 1200;

const RECRUIT = (700 * 60) / 100;

const EMPTY_BOARD = <number[][]>(
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
);

const PASS_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export {
  BLOCKED_ROW,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  PIECES,
  EMPTY_PIECE,
  COLORS_WITH_WHITE,
  BOARD_COLORS,
  SHADOW_COLORS,
  BOARD_UPDATED,
  PIECE_UPDATED,
  NEXT_PIECE_UPDATED,
  NEXT_UPDATED,
  SHADOWS_UPDATED,
  PLAYER_SHADOW_UPDATED,
  PLAYER_SCORE_UPDATED,
  PLAYER_LEVEL_UPDATED,
  PLAYER_IS_GAME_HOST,
  KEY_ARROW_UP_PRESSED,
  KEY_ARROW_RIGHT_PRESSED,
  KEY_ARROW_DOWN_PRESSED,
  KEY_ARROW_LEFT_PRESSED,
  KEY_ARROW_SPACE_PRESSED,
  MIN_PIECES,
  POINTS_FOR_ONE_LINE,
  POINTS_FOR_TWO_LINES,
  POINTS_FOR_THREE_LINES,
  POINTS_FOR_FOUR_LINES,
  STORE_RESET,
  EMPTY_BOARD,
  RECRUIT,
  USER_LOGGED_UPDATED,
  PASS_REGEX,
  EMAIL_REGEX,
};
