// https://tetris.fandom.com/wiki/SRS
 const COLUMNS = 10;
 const ROWS = 20;
 const BOARD_HEIGHT = 20;
 const BOARD_WIDTH = 10;
 const BLOCKED_ROW = 8;
 const MAX_NUMBER_OF_PLAYERS = 4;

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
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
    ],
    width: 4,
    height: 1,
    color: 7,
    still: false,
  },
];

export {
  PIECES,
  COLUMNS,
  ROWS,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BLOCKED_ROW,
  MAX_NUMBER_OF_PLAYERS,
};
