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
			return;
    }
  });
  return isLess;
};

const isYGreaterThanWidth = (piece: Piece): boolean => {
  let isGreater = false;
  piece.pos.forEach((pos) => {
    if (pos.y + 1 > BOARD_WIDTH) {
      isGreater = true;
			return;
    }
  });
  return isGreater;
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

	cleanPieceFromBoard(board,  piece);
	piece.pos.forEach(pos => {
		if (pos.y - 1 < 0 || board[pos.x][pos.y - 1] !== 0) {
			isFree = false;
			writeNewPieceToBoard(board, piece);
			return;
		}
	})
  return isFree;
}

const rightCellIsFree = (board: number[][], piece: Piece): boolean => {
  let isFree = true;

  cleanPieceFromBoard(board, piece);
  piece.pos.forEach((pos) => {
    if (pos.y + 1 > BOARD_WIDTH || board[pos.x][pos.y + 1] !== 0) {
      isFree = false;
      writeNewPieceToBoard(board, piece);
      return;
    }
  });
  return isFree;
};

const isXPlusOneFree = (board: number[][], piece: Piece): boolean => {
	 let isFree = true;

   cleanPieceFromBoard(board, piece);
   piece.pos.forEach((pos) => {
     if (pos.x + 1 >= BOARD_HEIGHT || ( board[pos.x + 1][pos.y] !== 0)) {
       isFree = false;
       writeNewPieceToBoard(board, piece);
       return;
     }
   });
   return isFree;
}

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
		case 38: {
			console.log(`Turn piece around`);
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

