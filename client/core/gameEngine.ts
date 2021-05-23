import { BOARD_HEIGHT, BOARD_WIDTH } from '../utils/const';

interface Piece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

const cleanPieceFromBoard = (board: number[][], piece: Piece): void => {
  piece.pos.forEach((pos) => {
    board[pos.y][pos.x] = 0;
  });
};

const isYLessThanZero = (piece: Piece): boolean => {
  let isLess = false;
  piece.pos.forEach((pos) => {
    if (pos.x - 1 < 0) {
      isLess = true;
      return;
    }
  });
  return isLess;
};

const isYGreaterThanWidth = (piece: Piece): boolean => {
  let isGreater = false;
  piece.pos.forEach((pos) => {
    if (pos.x + 1 > BOARD_WIDTH) {
      isGreater = true;
      return;
    }
  });
  return isGreater;
};


const updateHorizontalPosition = (piece: Piece, value: number): void => {
  piece.pos.forEach((pos) => {
    pos.x = pos.x + value;
  });
};

const updateVerticalPosition = (piece: Piece): void => {
  piece.pos.forEach((pos) => {
    pos.y = pos.y + 1;
  });
};

const writeNewPieceToBoard = (board: number[][], piece: Piece): void => {
  piece.pos.forEach((pos) => {
    board[pos.y][pos.x] = piece.color;
  });
};

const leftCellIsFree = (board: number[][], piece: Piece): boolean => {
  let isFree = true;

	cleanPieceFromBoard(board,  piece);
	piece.pos.forEach(pos => {
		if (pos.x - 1 < 0 || board[pos.y][pos.x - 1] !== 0) {
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
    if (pos.x + 1 > BOARD_WIDTH || board[pos.y][pos.x + 1] !== 0) {
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
     if (pos.y + 1 >= BOARD_HEIGHT || board[pos.y + 1][pos.x] !== 0) {
       isFree = false;
       writeNewPieceToBoard(board, piece);
       return;
     }
   });
   return isFree;
}

const rotate = (board: number[][], piece: Piece): void => {
  const diff = Math.floor(piece.height / 2);
  if (piece.pos[0].y - diff < 0) {
    return;
  }
  console.log(`before rotating ${piece.pos[0].y}`);
  piece.pos.forEach((pos) => console.log(`[${pos.y}][${pos.x}]`));
  // cleanPieceFromBoard(board, piece);
  // piece.pos.forEach((pos) => {
  //   const tmpY = pos.y;
  //   pos.y = pos.x - diff;
  //   pos.x = tmpY;
  // });
  // writeNewPieceToBoard(board, piece);
  console.log(`after rotating ${piece.pos[0].y}`);

  for (let y = 0; y < piece.height; y++) {
    for (let x = 0; x < piece.width; x++) {
      console.log(`${piece.pos[x].y} - ${piece.pos[x].x}`);
    }
  }
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
		case 38: {
			console.log(`Turn piece around`);
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

