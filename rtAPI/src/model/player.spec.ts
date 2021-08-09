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

  it('should return piece', () => {
    chaI.expect(player.piece.shape.color).to.be.equal(1);
  });

  it('should set player lost', () => {
    player.lost = true;
  });

  it('should player lost', () => {
    chaI.expect(player.lost).to.be.equal(true);
  });

  it('should set game lost At', () => {
    player.gameLostAt = Date.now();
  });

  it('should get game lost At', () => {
    let now = Date.now();
    chaI.expect(player.gameLostAt).to.be.at.lessThanOrEqual(now);
  });

  it('should set is host', () => {
    player.isHost = true;
  });

  it('should be host', () => {
    chaI.expect(player.isHost).to.be.equal(true);
  });

  it('should reset board', () => {
    player.resetBoard();
  });

  it('should update board shape', () => {
    player.boardShape = board.shape;
  });

  it('should return third row reached (true)', () => {
    chaI.expect(player.isThirdRowReached()).to.be.equal(true);
  });

  it('should return toObject', () => {
    chaI.expect(player.toObject().score).to.be.at.equal(0);
  });
});
