import {
  calculateScore,
  calculateLevel,
  playerScores,
  penalty,
  update,
  gameOver,
  isMoveDownAllowed,
  handleKeyDown,
} from '../core/gameEngine';
import {
  EMPTY_BOARD,
  EMPTY_PIECE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BLOCKED_ROW,
  PIECES,
  KEY_ARROW_UP_PRESSED,
  KEY_ARROW_RIGHT_PRESSED,
  KEY_ARROW_DOWN_PRESSED,
  KEY_ARROW_LEFT_PRESSED,
  KEY_ARROW_SPACE_PRESSED,
} from '../utils/const';

describe('should test all game engine functions', () => {
  const board = EMPTY_BOARD;
  beforeAll((done) => {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      board[BOARD_HEIGHT - 1][col] = BLOCKED_ROW;
      board[BOARD_HEIGHT - 3][col] = 1;
    }
    done();
  });
  it('should test calculateScore(1200)', () => {
    expect(calculateScore(0, 4)).toBe(1200);
  });

  it('should calculateLevel()', () => {
    expect(calculateLevel(42)).toBe(4);
  });

  it('should test playerScore(1)', () => {
    const emptyPiece = EMPTY_PIECE[0];
    emptyPiece.pos[0].y = 20;
    emptyPiece.pos[1].y = 21;

    expect(playerScores(board, emptyPiece)).toBe(1);
  });

  it('should call penalty()', () => {
    expect(penalty(board)).toBeTruthy();
  });

  it('should call upate()', () => {
    const piece = PIECES[5];
    expect(update(board, piece)).toBeTruthy();
  });

  it('should call gameOver', () => {
    const brd = EMPTY_BOARD;

    brd[2][2] = 1;
    expect(gameOver(brd)).toBe(true);
  });

  it('shoule call isMoveDownAllowed(false)', () => {
    const piece = PIECES[0];
    expect(isMoveDownAllowed(board, piece)).toBe(false);
  });

  it('should call handleKeyDown() and rotate', () => {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[y][x] = 0;
      }
    }
    const piece = PIECES[0];
    piece.pos.forEach((pos) => (pos.y += 2));

    expect(handleKeyDown(board, piece, KEY_ARROW_UP_PRESSED)).toBeTruthy();
  });

  it('should call handleKeyDown() and move right', () => {
    const piece = PIECES[0];
    piece.pos.forEach((pos) => (pos.y += 2));

    expect(handleKeyDown(board, piece, KEY_ARROW_RIGHT_PRESSED)).toBeTruthy();
  });

  it('should call handleKeyDown() and move left', () => {
    const piece = PIECES[0];
    piece.pos.forEach((pos) => (pos.y += 2));

    expect(handleKeyDown(board, piece, KEY_ARROW_LEFT_PRESSED)).toBeTruthy();
  });

  it('should call handleKeyDown() and move down', () => {
    const piece = PIECES[0];
    piece.pos.forEach((pos) => (pos.y += 2));

    expect(handleKeyDown(board, piece, KEY_ARROW_DOWN_PRESSED)).toBeTruthy();
  });

  it('should call handleKeyDown() and fall', () => {
    const piece = PIECES[0];
    piece.pos.forEach((pos) => (pos.y += 2));

    expect(handleKeyDown(board, piece, KEY_ARROW_SPACE_PRESSED)).toBeTruthy();
  });

  it('should call handleKeyDown() default', () => {
    const piece = PIECES[0];
    piece.pos.forEach((pos) => (pos.y += 2));

    expect(handleKeyDown(board, piece, 'KEY_DEFAULT')).toBeTruthy();
  });
});
