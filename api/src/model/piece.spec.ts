let chaI = require('chai');
let chaiHttp = require('chai-http');
import Piece from './Piece';

chaI.use(chaiHttp);

describe('Piece Model', () => {
  let piece: Piece;

  before(() => {
    piece = new Piece(0);
  });

  it('should increment Y', () => {
    piece.incrementY();
    chaI.expect(piece.shape.pos[0].y).to.be.equal(1);
  });

  it('should increment X', () => {
    piece.incrementX();
    chaI.expect(piece.shape.pos[0].x).to.be.equal(5);
  });

  it('should decrement X', () => {
    piece.decrementX();
    chaI.expect(piece.shape.pos[0].x).to.be.equal(4);
  });

  it('should return last Y position', () => {
    chaI.expect(piece.lastPosition()).to.be.equal(1);
  });
  it('should return piece shape', () => {
    chaI.expect(piece.pieceShape.pos[0].x).to.be.equal(4);
  });
});
