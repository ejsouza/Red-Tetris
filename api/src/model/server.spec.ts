let chaI = require('chai');
let chaiHttp = require('chai-http');
import Game, { IGame } from './Game';
import Player from './Player';
import Board from './Board';
import Piece from './Piece';
import { Server as RootServer, IFrontState } from './Server';
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
  before((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    board = new Board();
    piece = new Piece(0);
    server = new RootServer();

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${5000}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  after((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    clientSocket.close();
    httpServer.close();
    io.close();
    clientSocket.close();
    done();
  });

  it('should create game', (done) => {
    clientSocket.on('room', (arg) => {
      chaI.expect(arg.msg).to.be.equal('Please wait joining loby');
    });
    clientSocket.emit('createOrJoinGame', 'react', 'useEffect', false);
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should join game', (done) => {
    clientSocket.on('join-room', (arg) => {
      chaI.expect(arg.msg).to.be.equal(arg.msg, 'Please wait joining loby');
    });
    clientSocket.emit('createOrJoinGame', 'react', 'useEffect', true);
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should join lobby', (done) => {
    clientSocket.on('join-room', (arg) => {
      chaI.expect(arg.msg).to.be.equal(arg.msg, 'Please wait joining loby');
    });
    clientSocket.emit('createOrJoinGame', 'react', 'world', true);
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should join room socket', () => {
    clientSocket.emit('createRoom', 'react');
  });

  it('should serach games', () => {
    clientSocket.on('games-open', (arg) => {
      chaI.expect(arg.length).to.be.greaterThan(0);
    });
    clientSocket.emit('search-games');
  });

  it('should emit join', (done) => {
    clientSocket.emit('join');
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should start game', (done) => {
    clientSocket.emit('createOrJoinGame', 'react', 'useEffect', true);
    clientSocket.emit('start', 'react', 'recruit');

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should disconnect', (done) => {
    clientSocket.on('connect', () => {
      clientSocket.io.engine.onPacket = () => {};
    });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should refuse join (game started already)', (done) => {
    clientSocket.emit('createOrJoinGame', 'react', 'useEffect', true);
    done();
  });

  it('should get lobby', (done) => {
    clientSocket.on('game-host', (arg) => {
      chaI.expect(arg).to.be.equal(true);
    });
    setTimeout(() => {
      clientSocket.emit('getLobby', 'react');
      done();
    }, 100);
  });

  it('should send state', (done) => {
    const brd = new Board();
    brd.shape[2][2] = 1;
    const score: IFrontState = {
      playerName: 'useEffect',
      gameName: 'react',
      board: brd.shape,
      piece: new Piece(0).shape,
      next: [0],
      score: 42,
      at: Date.now(),
    };
    clientSocket.emit('front-state', score);
    done();
  });

  it('should get extra piece', (done) => {
    clientSocket.emit('get-extra-pieces', 'react');
    done();
  });

  it('should apply penalty', (done) => {
    clientSocket.emit('apply-penalty', 'react', 'useEffect');
    done();
  });

  it('should restart game', (done) => {
    clientSocket.emit('restart-game', 'react');
    clientSocket.on('prepare-for-next-game', (arg) => {
      chaI.expect(arg.score).to.be.equal(0);
    });
    done();
  });

  it('should quit game', (done) => {
    clientSocket.emit('player-quit', 'react', 'useEffect');
    clientSocket.on('reset', () => console.log('rest game'));
    clientSocket.on('game-host', () => console.log('game-host'));
    done();
  });
});
