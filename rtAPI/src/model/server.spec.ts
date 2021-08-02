let chaI = require('chai');
let chaiHttp = require('chai-http');
import Game, { IGame } from './Game';
import Player from './Player';
import Board from './Board';
import Piece from './Piece';
import { Server as RootServer } from './Server';
let { createServer } = require('http');
let { Server } = require('socket.io');
let Client = require('socket.io-client');
let assert = require('assert');

chaI.use(chaiHttp);

/***********************************************
 *                                             *
 *  WARNING Server should not be running!      *
 *  The test server should be running!         *
 *                                             *
 ***********************************************/

describe('Server Model', () => {
  let game: Game;
  let player: Player;
  let board: Board;
  let piece: Piece;
  let server: RootServer;
  let io, serverSocket, clientSocket, httpServer;
  before(() => {
    httpServer = createServer();
    io = new Server(httpServer);
    board = new Board();
    piece = new Piece(0);
    server = new RootServer();
    // httpServer.listen(() => {
    //   const port = httpServer.address().port;
    //   clientSocket = new Client(`http://localhost:${port}`);
    //   io.on('connection', (socket) => {
    //     serverSocket = socket;

    //     // player = new Player({
    //     //   name: 'player42',
    //     //   id: '424242',
    //     //   isHost: true,
    //     //   roomName: 'room42',
    //     // });
    //     // game = new Game({
    //     //   name: 'room42',
    //     //   players: [player],
    //     //   mode: 1,
    //     //   io,
    //     //   socket,
    //     // });
    //   });
    //   clientSocket.on('connect', done);
    // });
  });

  beforeEach((done) => {
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${5000}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    clientSocket.close();
    httpServer.close();
    done();
  });

  after((done) => {
    io.close();
    clientSocket.close();
    done();
  });

  it('should create game', (done) => {
    clientSocket.on('room', (arg) => {
      chaI.expect(arg.msg).to.be.equal('Please wait joining loby');
    });
    clientSocket.emit('createOrJoinGame', {
      roomName: 'react',
      userName: 'useEffect',
      join: false,
    });
    setTimeout(() => {
      done();
    }, 100);
  });
  // it('should not join game (same username)', () => {
  //   clientSocket.on('room', (arg) => {
  //     assert.equal(arg.msg, "This username 'useEffect' is already taken");
  //   });
  //   serverSocket.emit('createOrJoinGame', {
  //     roomName: 'react',
  //     userName: 'useEffect',
  //     join: true,
  //   });
  // });

  // it('should join game', () => {
  //   clientSocket.on('join-room', (arg) => {
  //     assert.equal(arg.msg, 'Please wait joining loby');
  //   });
  //   serverSocket.emit('createOrJoinGame', {
  //     roomName: 'react',
  //     userName: 'helloWorld',
  //     join: true,
  //   });
  // });

  // it('should serach games', () => {
  //   clientSocket.on('games-open', (arg) => {
  //     chaI.expect(arg.length).to.be.greaterThan(0);
  //   });
  //   serverSocket.emit('search-games');
  // });

  it('should emit join', (done) => {
    clientSocket.emit('join');
    setTimeout(() => {
      done();
    }, 100);
  });

  // it('should start game', () => {
  //   serverSocket.emit('start', { gameName: 'react', difficult: 'recruit' });
  // });
});
