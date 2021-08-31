let chaI = require('chai');
let chaiHttp = require('chai-http');
let assert = require('assert');
import Board from './Board';
import Piece from './Piece';

chaI.use(chaiHttp);

describe('Board Model', () => {
  let board: Board;
  let piece: Piece;
  before(() => {
    board = new Board();
    piece = new Piece(0);
  });
  it('should access board position 0', (done) => {
    chaI.expect(board.shape[0][0]).to.be.equal(0);
    done();
  });
  it('should draw piece', (done) => {
    board.drawPiece(piece.shape);
    chaI.expect(board.shape[1][4]).to.be.equal(1);
    done();
  });
  it('should clean board', (done) => {
    board.cleanPiece(piece.shape);
    chaI.expect(board.shape[1][4]).to.be.equal(0);
    done();
  });
});
