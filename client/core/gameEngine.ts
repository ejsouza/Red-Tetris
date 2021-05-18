import { BOARD_HEIGHT, BOARD_WIDTH } from '../utils/const';

interface Piece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

const cleanPieceFromBoard = (board: number[][], piece: Piece): void => {
  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = 0;
  });
};

const isYLessThanZero = (piece: Piece): boolean => {
  let isLess = false;
  piece.pos.forEach((pos) => {
    if (pos.y - 1 < 0) {
      isLess = true;
    }
  });
  return isLess;
};

const isYGreaterThanWidth = (piece: Piece): boolean => {
  let isGreater = false;
  piece.pos.forEach((pos) => {
    if (pos.y > BOARD_WIDTH - piece.width) {
      isGreater = true;
    }
  });
  return isGreater;
};

const isXPlusOneFree = (board: number[][], piece: Piece): boolean => {
  let isFree = false;
  let lastX = 0;
  let lastY = 0;

  piece.pos.forEach((pos) => {
    lastX = pos.x;
    lastY = pos.y;
    if (pos.x + 1 < BOARD_HEIGHT) {
      isFree = true;
    } else {
      isFree = false;
    }
  });
  console.log(`lastX := ${lastX}`);
  if (lastX < BOARD_HEIGHT - 1) {
	 if (board[lastX + 1][lastY - 1] !== 0 || board[lastX + 1][lastY] !== 0)
   {
    isFree = false;
  }
}
  return isFree;
};

const updateHorizontalPosition = (piece: Piece, value: number): void => {
  piece.pos.forEach((pos) => {
    pos.y = pos.y + value;
  });
};

const updateVerticalPosition = (piece: Piece): void => {
  piece.pos.forEach((pos) => {
    pos.x = pos.x + 1;
  });
};

const writeNewPieceToBoard = (board: number[][], piece: Piece): void => {
  piece.pos.forEach((pos) => {
    board[pos.x][pos.y] = piece.color;
  });
};

const leftCellIsFree = (board: number[][], piece: Piece): boolean => {
  let isFree = true;
  piece.pos.forEach((pos) => {
    if (
      board[pos.x][pos.y - piece.width] !== 0 &&
      board[pos.x][pos.y - piece.width - 1] !== 0
    ) {
      console.log(
        `[${board[pos.x][pos.y - piece.width]}] - [${
          board[pos.x][pos.y - piece.width - 1]
        }]`
      );
      isFree = false;
      return;
    }
  });
  return isFree;
};

const rightCellIsFree = (board: number[][], piece: Piece): boolean => {
  let isFree = true;
  piece.pos.forEach((pos) => {
    if (
      board[pos.x][pos.y + piece.width] !== 0 &&
      board[pos.x][pos.y + piece.width + 1] !== 0
    ) {
      console.log(
        `[${board[pos.x][pos.y + piece.width]}] - [${
          board[pos.x][pos.y + piece.width + 1]
        }]`
      );
      isFree = false;
      return;
    }
  });
  return isFree;
};

export const updateBoard = (
  board: number[][],
  piece: Piece,
  key: number
): void => {
  switch (key) {
    case 37: {
      if (!isYLessThanZero(piece) && leftCellIsFree(board, piece)) {
        cleanPieceFromBoard(board, piece);
        updateHorizontalPosition(piece, -1);
        writeNewPieceToBoard(board, piece);
      }
      break;
    }
    case 39: {
      if (!isYGreaterThanWidth(piece) && rightCellIsFree(board, piece)) {
        cleanPieceFromBoard(board, piece);
        updateHorizontalPosition(piece, 1);
        writeNewPieceToBoard(board, piece);
      }
      break;
    }
    case 40: {
      if (isXPlusOneFree(board, piece)) {
        cleanPieceFromBoard(board, piece);
        updateVerticalPosition(piece);
        writeNewPieceToBoard(board, piece);
      }
      break;
    }

    default:
      break;
  }
};

export const gameLoo = (
  board: number[][],
  piece: Piece
): [board: number[][], piece: Piece] => {
  const ROWS = 20;
  // const stopGame = (id: number) => clearInterval(id);

  // const loop = (board: number[][], piece: Piece): void => {
  //   console.log('[setInterval board] ', board);
  // };

  // const stopGameId = setInterval(loop, 1000, board, piece);
  console.log('getting here? ', piece.x);
  if (piece.x < ROWS - piece.height) {
    for (let y = 0, by = piece.y; y < piece.tetromino.length; y++, by++) {
      for (let x = 0, bx = piece.x; x < piece.tetromino.length; x++, bx++) {
        if (board[bx][by] === piece.tetromino[x][y]) {
          board[bx][by] = 0;
        }
      }
    }
    piece.x += 1;
    console.log(`enters condition ? ${piece.x}`);
    for (let y = 0, by = piece.y; y < piece.tetromino.length; y++, by++) {
      for (let x = 0, bx = piece.x; x < piece.tetromino.length; x++, bx++) {
        board[bx][by] = piece.tetromino[x][y];
      }
    }
  }
  return [board, piece];
};
