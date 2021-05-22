import * as socketIO from 'socket.io';
import { COLUMNS, ROWS, PIECES, BOARD_HEIGHT, BOARD_WIDTH } from './const';
import { Piece } from '../models/Piece';
import { Board } from '../models/Board';

interface IPiece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

export const createBoard = (socket: socketIO.Socket): [number[][], IPiece] => {
  // const board: number[][] = Array.from({ length: ROWS }, () =>
  //   Array(COLUMNS).fill(0)
  // );
  // const piece: IPiece = PIECES[Math.floor(Math.random() * 7)];
  // const piece: Piece = PIECES[6];
  const piece = new Piece();
  const board = new Board();
  board.drawPiece(piece.shape);

  // piece.shape.pos.forEach((pos) => {
  //   board[pos.x][pos.y] = piece.shape.color;
  // });
  socket.emit('newMap', board, piece);
  return [board.shape, piece.shape];
};

export const cleanPieceFromBoard = (board: number[][], piece: IPiece): void => {
  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = 0;
  });
};


export const draw = (board: number[][], piece: IPiece): boolean => {
  let gameOver = false;
  piece.pos.forEach((pos) => {
    pos.x += 1;
    board[pos.x][pos.y] = piece.color;
  });
  return gameOver;
};

const writePieceToBoard = (board: number[][], piece: IPiece): void => {
  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = piece.color;
  });
};


const isNextXCellFree = (board: number[][], piece: IPiece): boolean => {
  let isFree = true;

  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.x + 1 >= BOARD_HEIGHT || board[pos.x + 1][pos.y] !== 0) {
      isFree = false;
      writePieceToBoard(board, piece);
      return;
    }
  });
  return isFree;
};

const gameLoop = (board: number[][], piece: IPiece): boolean => {
  /**
   * Check for next piece place
   */
  if (!isNextXCellFree(board, piece)) {
    return true;
  }
  cleanPieceFromBoard(board, piece);
  return draw(board, piece);
};

export const startGameInterval = (
  socket: socketIO.Socket,
  board: number[][],
  piece: IPiece
): void => {
  socket.on('keydown', (args) => {
    board = args.board;
    piece = args.piece;
    socket.emit('updateMove', board, piece);
  });
  const interval = setInterval(() => {
    const winner = gameLoop(board, piece);

    if (!winner) {
      piece.pos.forEach((pos) =>
        console.log(`gameState[emit] x: ${pos.x} y: ${pos.y}`)
      );
      socket.emit('gameState', board, piece);
    } else {
      // if (isGameOver()) {
      if (0 > 1) {
        socket.emit('gameOver');
        clearInterval(interval);
      } else {
        // const newPiece: IPiece = PIECES[Math.floor(Math.random() * 7)];
        const newPiece = new Piece();
        // const newPiece: Piece = PIECES[6];
        newPiece.shape.pos.forEach((pos, index) => {
          board[pos.x][pos.y] = newPiece.shape.color;
          piece.pos[index].x = pos.x;
          piece.pos[index].y = pos.y;
        });
        piece.color = newPiece.shape.color;
        piece.height = newPiece.shape.height;
        piece.width = newPiece.shape.width;
        socket.emit('gameState', board, piece);
      }
    }
  }, 1000);
};
