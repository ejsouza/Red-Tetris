export const APIurl: string = 'http://localhost:8000/api/v1';
export const BASEurl: string = 'http://localhost:8000';
export const RT_API: string = 'http://localhost:5000';

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 10;
const BLOCKED_ROW = 8;


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
  '#FC03db',
];

export {
  BLOCKED_ROW,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EMPTY_PIECE,
  COLORS_WITH_WHITE,
  BOARD_COLORS,
};