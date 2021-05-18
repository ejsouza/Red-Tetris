import * as socketIO from 'socket.io';
import { COLUMNS, ROWS, PIECES, BOARD_HEIGHT, BOARD_WIDTH } from './const';

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
  const piece: Piece = PIECES[Math.floor(Math.random() * 4)];

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
  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = 0;
  });
};

const nextCellIsFree = (
  board: number[][],
  lastX: number,
  lastY: number
): boolean => {
  return board[lastX][lastY] === 0;
};

export const draw = (board: number[][], piece: Piece): boolean => {
  let gameOver = false;
  piece.pos.forEach((pos) => {
    pos.x += 1;
    board[pos.x][pos.y] = piece.color;
  });
  return gameOver;
};

const isXWithinBound = (piece: Piece): boolean => {
  return piece.pos[piece.height].x < BOARD_HEIGHT;
};

const isXPlusOneWithinBound = (piece: Piece): boolean => {
  return piece.pos[piece.height].x + 1 < BOARD_HEIGHT;
};

const isNextXCellFree = (board: number[][], piece: Piece): boolean => {
  let isFree = true;

  if (!isXPlusOneWithinBound(piece)) {
    return false;
  }
  piece.pos.forEach((pos) => {
    if (
      board[pos.x][pos.y] !== 0 &&
      board[piece.pos[piece.height].x + 1][pos.y] !== 0
    ) {
      isFree = false;
      return;
    }
  });
  return isFree;
};

const isNYCellFree = (board: number[][], piece: Piece): boolean => {
  let isFree = true;
  piece.pos.forEach(pos => {
    if (pos.y - 1 < 0 || pos.y + 1 > BOARD_WIDTH) {
      isFree = false;
      return;
    }
    if (board[pos.x][pos.y] !== 0 && board[pos.x][pos.y - 1] !== 0) {
      isFree = false;
      return;
    }
    if (board[pos.x][pos.y] !== 0 && board[pos.x][pos.y + 1] !== 0) {
      isFree = false;
      return;
    }
  })

  return isFree;
}

const gameLoop = (board: number[][], piece: Piece): boolean => {
  /**
   * Check for next piece place
   */
  if (!isXPlusOneWithinBound(piece) || !isNextXCellFree(board, piece)) {
    return true;
  }
  removeOldPiece(board, piece);
  return draw(board, piece);
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
        const newPiece: Piece = PIECES[Math.floor(Math.random() * 4)];
        newPiece.pos.forEach((pos, index) => {
          board[pos.x][pos.y] = newPiece.color;
          piece.pos[index].x = pos.x;
          piece.pos[index].y = pos.y;
        });;
        piece.color = newPiece.color;
        piece.height = newPiece.height;
        piece.width = newPiece.width;
        socket.emit('gameState', board, piece);
      }
    }
  }, 1000);
};
