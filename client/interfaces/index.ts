// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number
  name: string
}

interface IUser {
  success: boolean;
  id: string;
  token: string;
}

interface IShadow {
  player: string;
  board: number[][];
}

interface IPiece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
  still: boolean;
}

interface IInitialState {
  board: number[][];
  piece: IPiece;
  nextPiece: IPiece;
  shadows: IShadow[];
}

interface IBoard {
  board: number[][];
}

export type { IPiece, IInitialState, IBoard, IShadow, IUser };