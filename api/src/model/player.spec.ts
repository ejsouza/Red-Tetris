let chaI = require('chai');
let chaiHttp = require('chai-http');
import Player from './Player';
import Piece from './Piece';
import Board from './Board';

chaI.use(chaiHttp);

describe('Player Model', () => {
  let player: Player;
  let piece: Piece;
  let board: Board;
  before(() => {
    player = new Player({
      name: 'nightmare',
      id: '424242',
      isHost: true,
      roomName: 'room42',
    });
    piece = new Piece(0);
    player.piece = piece;
    board = new Board();
    board.shape[2][0] = 1;
  });

  it('should return piece', (done) => {
    chaI.expect(player.piece.shape.color).to.be.equal(1);
    done();
  });

  it('should set player lost', (done) => {
    player.lost = true;
    chaI.expect(player.lost).to.be.equal(true);
    done();
  });

  it('should set game lost At', (done) => {
    player.gameLostAt = Date.now();
    done();
  });

  it('should get game lost At', (done) => {
    let now = Date.now();
    chaI.expect(player.gameLostAt).to.be.at.lessThanOrEqual(now);
    done();
  });

  it('should set is host', (done) => {
    player.isHost = true;
    chaI.expect(player.isHost).to.be.equal(true);
    done();
  });

  it('should reset board', (done) => {
    player.resetBoard();
    done();
  });

  it('should update board shape', (done) => {
    player.boardShape = board.shape;
    done();
  });

  it('should return third row reached (true)', (done) => {
    chaI.expect(player.isThirdRowReached()).to.be.equal(true);
    done();
  });

  it('should return toObject', (done) => {
    chaI.expect(player.toObject().score).to.be.at.equal(0);
    done();
  });
});
