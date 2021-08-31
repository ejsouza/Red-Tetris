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
  let io, serverSocket, clientSocket;
  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    board = new Board();
    piece = new Piece(0);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;

        player = new Player({
          name: 'player42',
          id: '424242',
          isHost: true,
          roomName: 'room42',
        });
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

  after(() => {
    io.close();
    clientSocket.close();
  });

  it('should create new game', () => {
    game.start();
    clientSocket.on('startLoop', (arg) => {
      assert.equal(arg, 'startLoop');
    });
  });

  it('should add player', () => {
    const player2 = new Player({
      name: 'player2',
      id: '222222',
      isHost: true,
      roomName: 'room42',
    });
    game.addPlayer(player2);
    chaI.expect(game.players.length).to.be.equal(2);
  });

  it('should remove player', () => {
    game.removePlayer('player2');
    chaI.expect(game.players.length).to.be.equal(1);
  });

  it('should not remove player', () => {
    game.removePlayer('player2');
    chaI.expect(false);
  });

  it('should update queue', () => {
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
  });

  it('should erase queue', () => {
    game.eraseQueue();
    chaI.expect(game.getQueueLen()).to.be.equal(0);
  });

  it('should create new piece', () => {
    game.createNewPieces();
    clientSocket.on('extra-pieces', (arg) => {
      chaI.expect(arg.newPieces.shape.length).to.be.equal(4);
    });
  });

  it('should update', () => {
    game.update();
  });

  it('should send shadows', () => {
    clientSocket.on('arrayOfPlayer', (arg) => {
      chaI.expect(arg.palyer).to.be.equal('player42');
    });
  });

  it('should youLost', () => {
    clientSocket.on('youLost', (arg) => {
      chaI.expect(arg.gameOver).to.be.equal(true);
    });
  });

  it('should youWin', () => {
    clientSocket.on('youWin', (arg) => {
      chaI.expect(arg.gameOver).to.be.equal(true);
    });
  });

  it('should game over', () => {
    game.gameOver();
    clientSocket.on('game-is-over', (arg) => {
      assert.equal(arg, 'game-is-over');
    });
  });
});
