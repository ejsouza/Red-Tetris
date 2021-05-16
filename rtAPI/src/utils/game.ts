import * as socketIO from 'socket.io';
import { COLUMNS, ROWS, PIECES } from './const';

interface Piece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

export const createBoard = (socket: socketIO.Socket): [number[][], Piece] => {
  const board: number[][] = Array.from({ length: ROWS }, () =>
    Array(COLUMNS).fill(0)
  );
  const piece: Piece = PIECES[0];

  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = piece.color;
  });
  socket.emit('newMap', board, piece);
  return [board, piece];
};

export const updateBoard = (
  board: number[][],
  piece: Piece
): [number[][], Piece] => {
  console.log(`updateBoard`);
  console.log(piece.y, piece.x, piece.tetromino);
  if (piece.x < ROWS - piece.height) {
    for (let y = 0, by = piece.y; y < piece.tetromino.length; y++, by++) {
      for (let x = 0, bx = piece.x; x < piece.tetromino.length; x++, bx++) {
        if (board[bx][by] === piece.tetromino[x][y]) {
          board[bx][by] = 0;
        }
      }
    }
    piece.x += 1;

    for (let y = 0, by = piece.y; y < piece.tetromino.length; y++, by++) {
      for (let x = 0, bx = piece.x; x < piece.tetromino.length; x++, bx++) {
        board[bx][by] = piece.tetromino[x][y];
      }
    }
  } else {
    return;
  }

  console.log('piece >>> ', piece.x);
  return [board, piece];
};

export const movePiece = (
  board: number[][],
  piece: Piece,
  direction: number
): [number[][], Piece] => {
  console.log(`movePiece()`);
  console.log(piece);
  const check = piece.y + direction;

  if (check >= 0 && check < ROWS && piece.x < ROWS - piece.height) {
    for (let y = 0, by = piece.y; y < piece.tetromino.length; y++, by++) {
      for (let x = 0, bx = piece.x; x < piece.tetromino.length; x++, bx++) {
        if (board[bx][by] === piece.tetromino[x][y]) {
          board[bx][by] = 0;
        }
      }
    }

    piece.y = check;
    // piece.x += 1;
    for (let y = 0, by = piece.y; y < piece.tetromino.length; y++, by++) {
      for (let x = 0, bx = piece.x; x < piece.tetromino.length; x++, bx++) {
        board[bx][by] = piece.tetromino[x][y];
      }
    }
  }
  return [board, piece];
};

export const removeOldPiece = (board: number[][], piece: Piece): void => {
  console.log(`is new piece ? `);
  console.log(piece);
  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = 0;
  });
};

export const draw = (
  socket: socketIO.Socket,
  board: number[][],
  piece: Piece
): boolean => {
  let gameOver = false;
  piece.pos.forEach((pos) => {
    pos.x += 1;
    if (pos.x >= ROWS /* or is overother block */) {
      console.log('here ', pos.x);
      if (pos.x === ROWS) {
        console.log(`enters >>>`);
        console.log('Before ', piece.pos);
        piece = PIECES[0];
        socket.emit('gameState', board, piece);
        console.log('After ', piece.pos);
        return;
      } else {
        gameOver = true;
        return;
      }
    }
    board[pos.x][pos.y] = piece.color;
  });
  return gameOver;
};

const gameLoop = (
  socket: socketIO.Socket,
  board: number[][],
  piece: Piece
): boolean => {
  removeOldPiece(board, piece);
  return draw(socket, board, piece);
};

export const startGameInterval = (
  socket: socketIO.Socket,
  board: number[][],
  piece: Piece
): void => {
  socket.on('keydown', (args) => {
    switch (args.key) {
      case 37: {
        board = args.board;
        piece = args.piece;
        socket.emit('updateMove', board, piece);
        break;
      }
      case 39: {
        board = args.board;
        piece = args.piece;
        socket.emit('updateMove', board, piece);
        break;
      }
      case 40: {
        board = args.board;
        piece = args.piece;
        socket.emit('updateMove', board, piece);
        break;
      }

      default:
        break;
    }
  });

  const interval = setInterval(() => {
    const winner = gameLoop(socket, board, piece);

    if (!winner) {
      socket.emit('gameState', board, piece);
    } else {
      socket.emit('gameOver');
      clearInterval(interval);
    }
  }, 1000);
};
