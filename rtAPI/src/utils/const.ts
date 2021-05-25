// https://tetris.fandom.com/wiki/SRS
export const COLUMNS = 10;
export const ROWS = 20;
export const BOARD_HEIGHT = 20;
export const BOARD_WIDTH = 10;
export const BLOCKED_ROW = 8;

export const PIECES = [
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
  },
  {
    pos: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
    ],
    width: 4,
    height: 1,
    color: 7,
  },
];
