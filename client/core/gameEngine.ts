import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EMPTY_PIECE,
  BLOCKED_ROW,
} from '../utils/const';

interface IPiece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

const cleanPieceFromBoard = (board: number[][], piece: IPiece): void => {
  piece.pos.forEach((pos) => {
    board[pos.y][pos.x] = 0;
  });
};

const isYLessThanZero = (piece: IPiece): boolean => {
  let isLess = false;
  piece.pos.forEach((pos) => {
    if (pos.x - 1 < 0) {
      isLess = true;
      return;
    }
  });
  return isLess;
};

const isYGreaterThanWidth = (piece: IPiece): boolean => {
  let isGreater = false;
  piece.pos.forEach((pos) => {
    if (pos.x + 1 > BOARD_WIDTH) {
      isGreater = true;
      return;
    }
  });
  return isGreater;
};

const updateHorizontalPosition = (piece: IPiece, value: number): void => {
  piece.pos.forEach((pos) => {
    pos.x = pos.x + value;
  });
};

const updateVerticalPosition = (piece: IPiece): void => {
  piece.pos.forEach((pos) => {
    pos.y = pos.y + 1;
  });
};

const writeNewPieceToBoard = (board: number[][], piece: IPiece): void => {
  piece.pos.forEach((pos) => {
    board[pos.y][pos.x] = piece.color;
  });
};

const leftCellIsFree = (board: number[][], piece: IPiece): boolean => {
  let isFree = true;

  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.x - 1 < 0 || board[pos.y][pos.x - 1] !== 0) {
      isFree = false;
      writeNewPieceToBoard(board, piece);
      return;
    }
  });
  return isFree;
};

const rightCellIsFree = (board: number[][], piece: IPiece): boolean => {
  let isFree = true;

  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.x + 1 > BOARD_WIDTH || board[pos.y][pos.x + 1] !== 0) {
      isFree = false;
      writeNewPieceToBoard(board, piece);
      return;
    }
  });
  return isFree;
};

export const isYPlusOneFree = (board: number[][], piece: IPiece): boolean => {
  let isFree = true;

  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.y + 1 >= BOARD_HEIGHT || board[pos.y + 1][pos.x] !== 0) {
      isFree = false;
      writeNewPieceToBoard(board, piece);
      return;
    }
  });
  return isFree;
};

const isGameOver = (piece: IPiece): boolean => {
  let gameOver = BOARD_HEIGHT;
  piece.pos.forEach((pos) => {
    if (pos.y < gameOver) {
      gameOver = pos.y;
    }
  });
  return gameOver < piece.height;
};

const newPieceFitsInBoard = (board: number[][], piece: IPiece): boolean => {
  let fits = true;
  piece.pos.forEach((pos) => {
    if (
      pos.x < 0 ||
      pos.x >= BOARD_WIDTH ||
      pos.y < 0 ||
      pos.y >= BOARD_HEIGHT ||
      board[pos.y][pos.x] !== 0
    ) {
      fits = false;
      return;
    }
  });
  return fits;
};
const rotate = (board: number[][], piece: IPiece): void => {
  cleanPieceFromBoard(board, piece);

  const rotatedPiece: IPiece = EMPTY_PIECE[0];
  const xLen: number[] = [];
  const yLen: number[] = [];
  rotatedPiece.color = piece.color;

  const pos = piece.height < piece.width ? piece.height : piece.width;
  const baseX = piece.pos[pos].x;
  const baseY = piece.pos[pos].y;

  rotatedPiece.pos.forEach((pos) => {
    pos.x = pos.y = 0;
  });
  /**
   * BASE ALGORITHM TO ROTATE PIECE
   *   clockwise         counter clockwise
   * 		[ 0   1 ]          [ 0  -1 ]
   *    [ -1  0 ]          [ 1   0 ]
   */
  piece.pos.forEach((pos, index) => {
    const newX = 0 * (pos.x - baseX) + 1 * (pos.y - baseY);
    const newY = -1 * (pos.x - baseX) + 0 * (pos.y - baseY);
    if (!xLen.includes(pos.x)) {
      xLen.push(pos.x);
    }
    if (!yLen.includes(pos.y)) {
      yLen.push(pos.y);
    }
    rotatedPiece.pos[index].x = baseX + newX;
    rotatedPiece.pos[index].y = baseY + newY;
  });
  rotatedPiece.height = xLen.length;
  rotatedPiece.width = yLen.length;

  /** Check if after rotating pieces fits on board */
  if (newPieceFitsInBoard(board, rotatedPiece)) {
    rotatedPiece.pos.forEach((pos, index) => {
      piece.pos[index].x = pos.x;
      piece.pos[index].y = pos.y;
    });
    piece.height = rotatedPiece.height;
    piece.width = rotatedPiece.width;
  }
  writeNewPieceToBoard(board, piece);
};

const drawNext = (board: number[][], piece: IPiece) => {
  piece.pos.forEach((pos) => {
    board[pos.y][pos.x] = 0;
    pos.y += 1;
    board[pos.y][pos.x] = piece.color;
  });
};

export const updateBoard = (
  board: number[][],
  piece: IPiece,
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
    case 38: {
      rotate(board, piece);
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
      // for (let col = piece.pos[piece.height].y; col <)
      if (isYPlusOneFree(board, piece)) {
        cleanPieceFromBoard(board, piece);
        updateVerticalPosition(piece);
        writeNewPieceToBoard(board, piece);
        // drawNext(board, piece);
      }
      break;
    }

    default:
      break;
  }
};

const updatePiece = (
  board: number[][],
  piece: IPiece,
  nextPiece: IPiece
): void => {
  nextPiece.pos.forEach((pos, index) => {
    board[pos.y][pos.x] = nextPiece.color;
    piece.pos[index].y = pos.y;
    piece.pos[index].x = pos.x;
  });
  piece.height = nextPiece.height;
  piece.width = nextPiece.width;
  piece.color = nextPiece.color;
};

const score = (board: number[][], piece: IPiece): number => {
  let min = BOARD_HEIGHT;
  let height = 0;
  let score = 0;

  piece.pos.forEach((pos) => {
    height = pos.y > height ? pos.y : height;
    min = pos.y < min ? pos.y : min;
  });

  while (height >= min) {
    let count = 0;

    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (board[height][col] === BLOCKED_ROW) {
        break;
      }
      if (board[height][col] !== 0) {
        count++;
      }
    }
    if (count === BOARD_WIDTH) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        board[height][col] = 0;
      }
      for (let h = height; h > 0; h--) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          board[h][col] = board[h - 1][col];
        }
      }
      score++;
    } else {
      height--;
    }
  }
  // Return number fo rows scored for number of penalities for opponents
  return score;
};

const penalty = (board: number[][]): void => {
  let row = BOARD_HEIGHT - 1;

  while (row > 0 && board[row][0] === BLOCKED_ROW) {
    row--;
  }

  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = BLOCKED_ROW;
  }
};

export { cleanPieceFromBoard, isGameOver, updatePiece, score, penalty };
