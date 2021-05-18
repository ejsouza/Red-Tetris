export const COLUMNS = 10;
export const ROWS = 20;
export const BOARD_HEIGHT = 20;
export const BOARD_WIDTH = 10;

export const TETRIS = [
  {
    tetromino: [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    x: 0,
    y: 4,
    width: 2,
    height: 2,
  },
  {
    tetromino: [
      [0, 2, 0],
      [2, 2, 2],
      [0, 0, 0],
    ],
    x: 0,
    y: 3,
    width: 2,
    height: 2,
  },
  {
    tetromino: [
      [3, 0, 0],
      [3, 3, 3],
      [0, 0, 0],
    ],
    x: 0,
    y: 3,
    width: 2,
    height: 2,
  },
  {
    tetromino: [
      [0, 0, 4],
      [4, 4, 4],
      [0, 0, 0],
    ],
    x: 0,
    y: 3,
    width: 2,
    height: 2,
  },
  {
    tetromino: [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    x: 0,
    y: 3,
    width: 2,
    height: 2,
  },
  {
    tetromino: [
      [6, 6, 0],
      [0, 6, 6],
      [0, 0, 0],
    ],
    x: 0,
    y: 3,
    width: 3,
    height: 2,
  },
  {
    tetromino: [
      [0, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 7, 0, 0],
    ],
    x: 0,
    y: 3,
    width: 1,
    height: 4,
  },
];

export const PIECES = [
  {
    pos: [
      { x: 0, y: 4 },
      { x: 0, y: 5 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
    ],
    width: 2,
    height: 2,
    color: 1,
  },
  {
    pos: [
      { x: 0, y: 4 },
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
    ],
    width: 2,
    height: 2,
    color: 2,
  },
  {
    pos: [
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
    ],
    width: 2,
    height: 2,
    color: 3,
  },
  {
    pos: [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 1, y: 4 },
      { x: 1, y: 3 },
    ],
    width: 2,
    height: 2,
    color: 4,
  },
];
