import { posix } from 'node:path';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EMPTY_PIECE,
  BLOCKED_ROW,
  KEY_ARROW_UP_PRESSED,
  KEY_ARROW_RIGHT_PRESSED,
  KEY_ARROW_DOWN_PRESSED,
  KEY_ARROW_LEFT_PRESSED,
  KEY_ARROW_SPACE_PRESSED,
  POINTS_FOR_ONE_LINE,
  POINTS_FOR_TWO_LINES,
  POINTS_FOR_THREE_LINES,
  POINTS_FOR_FOUR_LINES,
} from '../utils/const';

interface IPiece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
  still: boolean;
}

type TUpdate = [board: number[][], piece: IPiece];

type IKeyDown = [board: number[][] | null, piece: IPiece | null];

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

const firstRowFree = (board: number[][]): boolean => {
  let isFree = true;
  for (let col = 0; col < BOARD_WIDTH; col++) {
    if (board[0][col] !== 0) {
      isFree = false;
      break;
    }
  }
  return isFree;
};

const writeAsMuchAsPossibleToBoard = (
  board: number[][],
  piece: IPiece
): void => {
  console.log(`writeAsMuchAsPossibleToBoard() pieceHeight ${piece.height}`);
  if (firstRowFree(board)) {
    piece.pos.forEach((pos) => {
      console.log(`y: ${pos.y} x: ${pos.x}`);
      if (pos.y === 1 && board[pos.y - 1][pos.x] === 0) {
        board[pos.y - 1][pos.x] = piece.color;
        console.log(`writed last to row`);
      }
    });
  }
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
    if (pos.x + 1 === BOARD_WIDTH || board[pos.y][pos.x + 1] !== 0) {
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
    if (pos.y + 1 === BOARD_HEIGHT || board[pos.y + 1][pos.x] !== 0) {
      isFree = false;
      writeNewPieceToBoard(board, piece);
      return;
    }
  });
  return isFree;
};

const isGameOver = (board: number[][], nextPiece: IPiece): boolean => {
  let gameOver = false;
  nextPiece.pos.forEach((pos) => {
    if (board[pos.y][pos.x] !== 0) {
      gameOver = true;
      return;
    }
  });

  return gameOver;
  // let gameOver = BOARD_HEIGHT;
  // piece.pos.forEach((pos) => {
  //   if (pos.y < gameOver) {
  //     gameOver = pos.y;
  //     // Can break out of the loop, take the very first Y position
  //     return ;
  //   }
  // });
  /**
   * Check gameOver < 3 because at the begining every piece has height = 2
   * and with this logic we can have a gameOver at position 3 if the last
   * piece set was the I in vertical so we still have 3 rows and another
   * piece is still possible to be set
   */
  // return ((gameOver < piece.height) && (gameOver < 3));
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

const rotate = (board: number[][], piece: IPiece): boolean => {
  let rotated = false;
  
  cleanPieceFromBoard(board, piece);

  const rotatedPiece: IPiece = EMPTY_PIECE[0];
  const xLen: number[] = [];
  const yLen: number[] = [];
  rotatedPiece.color = piece.color;

  const pos = piece.height < piece.width ? piece.height : piece.width;
  const baseX = piece.pos[pos].x;
  const baseY = piece.pos[pos].y;

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
    rotated = true;
    rotatedPiece.pos.forEach((pos, index) => {
      piece.pos[index].x = pos.x;
      piece.pos[index].y = pos.y;
    });
    piece.height = rotatedPiece.height;
    piece.width = rotatedPiece.width;
  }
  writeNewPieceToBoard(board, piece);
  return rotated;
};

export const updateBoard = (
  board: number[][],
  piece: IPiece,
  key: number
): void => {
  if (piece.still) {
    return;
  }
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

const playerScores = (board: number[][], piece: IPiece): number => {
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

const penalty = (board: number[][]) => {
  let row = BOARD_HEIGHT - 1;

  while (row > 0 && board[row][0] === BLOCKED_ROW) {
    row--;
  }

  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = BLOCKED_ROW;
  }
  return board;
};

/*********************** V1 ******************** */

const draw = (board: number[][], piece: IPiece) => {
  piece.pos.forEach((pos) => (board[pos.y][pos.x] = piece.color));
};

const incrementY = (piece: IPiece) => {
  piece.pos.forEach((pos) => pos.y++);
};

const incrementX = (piece: IPiece) => {
  piece.pos.forEach((pos) => pos.x++);
};

const decrementX = (piece: IPiece) => {
  piece.pos.forEach((pos) => pos.x--);
};

const update = (board: number[][], piece: IPiece): TUpdate => {
  // cleanPieceFromBoard(board, piece);
  incrementY(piece);
  draw(board, piece);
  return [[...board], piece];
};

const isMoveRightAllowed = (board: number[][], piece: IPiece): boolean => {
  let canMove = true;
  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (
      pos.y < 2 ||
      pos.x + 1 === BOARD_WIDTH ||
      board[pos.y][pos.x + 1] !== 0
    ) {
      // if cannot move right draw piece to the same position
      // draw();
      canMove = false;
      return false;
    }
  });
  // if canMove piece will be draw in moveRight
  return canMove;
};

const isMoveLeftAllowed = (board: number[][], piece: IPiece): boolean => {
  let canMove = true;
  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.y < 2 || pos.x - 1 < 0 || board[pos.y][pos.x - 1] !== 0) {
      // if cannot move left draw piece to the same position
      // draw();
      canMove = false;
      return false;
    }
  });
  // if canMove piece will be draw in moveLeft
  return canMove;
};

const isMoveDownAllowed = (board: number[][], piece: IPiece): boolean => {
  let canMove = true;
  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.y + 1 === BOARD_HEIGHT || board[pos.y + 1][pos.x] !== 0) {
      // if cannot move down draw piece to the same position
      draw(board, piece);
      canMove = false;
      return false;
    }
  });
  // if canMove piece will be draw in moveDown
  return canMove;
};

const fall = (board: number[][], piece: IPiece) => {
  cleanPieceFromBoard(board, piece);
  let allowed = true;
  while (allowed) {
    let increment = true;
    piece.pos.forEach((pos) => {
      if (pos.y + 1 === BOARD_HEIGHT || board[pos.y + 1][pos.x] !== 0) {
        allowed = false;
        increment = false;
      }
    });
    if (increment) {
      incrementY(piece);
    }
  }
  draw(board, piece);
};

const handleKeyDown = (
  board: number[][],

  piece: IPiece,

  key: string
): IKeyDown => {
  switch (key) {
    case KEY_ARROW_UP_PRESSED:
      if (rotate(board, piece)) {
        return [[...board], piece];
      }
      break;
    case KEY_ARROW_RIGHT_PRESSED:
      if (isMoveRightAllowed(board, piece)) {
        incrementX(piece);
        draw(board, piece);
        return [[...board], piece];
      }
      break;
    case KEY_ARROW_DOWN_PRESSED:
      if (isMoveDownAllowed(board, piece)) {
        incrementY(piece);
        draw(board, piece);
        return [[...board], piece];
      }
      break;
    case KEY_ARROW_LEFT_PRESSED:
      if (isMoveLeftAllowed(board, piece)) {
        decrementX(piece);
        draw(board, piece);
        return [[...board], piece];
      }
      break;
    case KEY_ARROW_SPACE_PRESSED:
      fall(board, piece);
      return [board, piece];
    default:
      return [null, null];
  }
  return [null, null];
};

const calculateScore = (level: number, score: number) => {
  let s = 0;
  if (score === 1) {
    s = (level + 1) * POINTS_FOR_ONE_LINE;
  } else if (score === 2) {
    s = (level + 1) * POINTS_FOR_TWO_LINES;
  } else if (score === 3) {
    s = (level + 1) * POINTS_FOR_THREE_LINES;
  } else {
    s = (level + 1) * POINTS_FOR_FOUR_LINES;
  }
  return s;
}

const calculateLevel = (lines: number) => {
  return Math.floor(lines / 10);
} 

const gameOver = (board: number[][]) => {
  let over = false;
  for (let col = 0; col < BOARD_WIDTH; col++) {
    if (board[2][col] !== 0) {
      over = true;
      break;
    }
  }
  return over;
}

const resetBoard = (board: number[][]) => {
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      board[row][col] = 0;
    }
  }
  return board;
}

export {
  cleanPieceFromBoard,
  isGameOver,
  updatePiece,
  playerScores,
  penalty,
  writeAsMuchAsPossibleToBoard,
  update,
  handleKeyDown,
  isMoveDownAllowed,
  gameOver,
  calculateScore,
  calculateLevel,
  resetBoard,
};
