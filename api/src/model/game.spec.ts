let chaI = require('chai');
let chaiHttp = require('chai-http');
import Game, { IGame } from './Game';
import Player from './Player';
import Board from './Board';
import Piece from './Piece';
import { IFrontState } from './Server';
let { createServer } = require('http');
let { Server } = require('socket.io');
let Client = require('socket.io-client');
let assert = require('assert');

chaI.use(chaiHttp);

describe('Game Model', () => {
  let game: Game;
  let player: Player;
  let board: Board;
  let piece: Piece;
  let io, serverSocket, clientSocket, port;
  before((done) => {
    board = new Board();
    piece = new Piece(0);
    player = new Player({
      name: 'player42',
      id: '424242',
      isHost: true,
      roomName: 'room42',
    });

    const httpServer = createServer();
    io = new Server(httpServer);

    httpServer.listen(() => {
      port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;

        game = new Game({
          name: 'room42',
          players: [player],
          mode: 1,
          io,
          socket,
        });
      });
      clientSocket.on('connect', done);
    });
  });

  beforeEach(function (done) {
    clientSocket = new Client(`http://localhost:${port}`);
    clientSocket.on('connect', function () {
      done();
    });
  });

  it('should create new game', (done) => {
    game.start();
    clientSocket.on('startLoop', (arg) => {
      assert.equal(arg, 'startLoop');
    });
    done();
  });

  it('should add player', (done) => {
    const player2 = new Player({
      name: 'player2',
      id: '222222',
      isHost: true,
      roomName: 'room42',
    });
    game.addPlayer(player2);
    chaI.expect(game.players.length).to.be.equal(2);
    done();
  });

  it('should remove player', (done) => {
    game.removePlayer('player2');
    chaI.expect(game.players.length).to.be.equal(1);
    done();
  });

  it('should not remove player', (done) => {
    game.removePlayer('player2');
    chaI.expect(false);
    done();
  });

  it('should update queue', (done) => {
    let state: IFrontState = {
      playerName: 'Godsmack',
      gameName: 'room42',
      board: board.shape,
      piece: piece.shape,
      next: [1],
      score: 4242,
      at: Date.now(),
    };
    game.queue(state);
    chaI.expect(game.getQueueLen()).to.be.equal(1);
    done();
  });

  it('should erase queue', (done) => {
    game.eraseQueue();
    chaI.expect(game.getQueueLen()).to.be.equal(0);
    done();
  });

  it('should create new piece', (done) => {
    game.createNewPieces();
    clientSocket.on('extra-pieces', (arg) => {
      chaI.expect(arg.newPieces.shape.length).to.be.equal(4);
    });
    done();
  });

  it('should update', (done) => {
    game.update();
    done();
  });

  it('should send shadows', (done) => {
    clientSocket.on('arrayOfPlayer', (arg) => {
      chaI.expect(arg.palyer).to.be.equal('player42');
    });
    done();
  });

  it('should youLost', (done) => {
    clientSocket.on('youLost', (arg) => {
      chaI.expect(arg.gameOver).to.be.equal(true);
    });
    done();
  });

  it('should youWin', (done) => {
    clientSocket.on('youWin', (arg) => {
      chaI.expect(arg.gameOver).to.be.equal(true);
    });
    done();
  });

  it('should game over', (done) => {
    game.gameOver();
    clientSocket.on('game-is-over', (arg) => {
      assert.equal(arg, 'game-is-over');
    });
    done();
  });
});
