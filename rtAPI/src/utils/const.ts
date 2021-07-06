// https://tetris.fandom.com/wiki/SRS
 const COLUMNS = 10;
 const ROWS = 20;
 const BOARD_HEIGHT = 22;
 const BOARD_WIDTH = 10;
 const BLOCKED_ROW = 8;
 const MAX_NUMBER_OF_PLAYERS = 4;

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
 const VETERAN = (500 * 60) / 100;
 const HARDCORE = (300 * 60) / 100;
 const INSANE = (100 * 60) / 100;

 const SHADOWS = 'arrayOfPlayers';
 const SHADOW = 'arrayOfPlayer';
 const UPDATE_BOARD = 'updateBoard';
 

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

export {
  PIECES,
  COLUMNS,
  ROWS,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BLOCKED_ROW,
  MAX_NUMBER_OF_PLAYERS,
  EMPTY_PIECE,
  KEY_ARROW_UP_PRESSED,
  KEY_ARROW_RIGHT_PRESSED,
  KEY_ARROW_DOWN_PRESSED,
  KEY_ARROW_LEFT_PRESSED,
  KEY_ARROW_SPACE_PRESSED,
  POINTS_FOR_ONE_LINE,
  POINTS_FOR_TWO_LINES,
  POINTS_FOR_THREE_LINES,
  POINTS_FOR_FOUR_LINES,
  RECRUIT,
  VETERAN,
  HARDCORE,
  INSANE,
  SHADOWS,
  SHADOW,
  UPDATE_BOARD,
};
