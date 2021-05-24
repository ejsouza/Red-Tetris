export const APIurl: string = 'http://localhost:8000/api/v1';
export const BASEurl: string = 'http://localhost:8000';
export const RT_API: string = 'http://localhost:5000';

export const BOARD_HEIGHT = 20;
export const BOARD_WIDTH = 10;


export const EMPTY_PIECE = [
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
  },
];

export interface IPiece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

export interface IBoard {
  board: number[][];
}