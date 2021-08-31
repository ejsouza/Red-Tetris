let chaI = require('chai');
let chaiHttp = require('chai-http');
let { createServer } = require('http');
let { Server } = require('socket.io');
let Client = require('socket.io-client');
let assert = require('assert');
import {
  createRoom,
  addPlayerToRoom,
  emitSuccesfullyCreated,
  emitRoomIsFull,
  emitUserNametaken,
} from './RoomController';

chaI.use(chaiHttp);

describe('Room Controller', () => {
  let io, serverSocket, clientSocket;
  beforeEach((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterEach(() => {
    io.close();
    clientSocket.close();
  });

  it('should create room', (done) => {
    let room1 = createRoom('room42', 'player42', '424242');
    chaI.expect(room1.isOpen).to.be.true;
    chaI.expect(room1.name).to.be.equal('room42');
    done();
  });

  it('should add player to room', (done) => {
    let room2 = createRoom('room2', 'player2', '222222');
    addPlayerToRoom(room2, 'toto', '212121');
    chaI.expect(room2.players.length).to.be.equal(2);
    done();
  });

  it('should emit success created (join-room)', (done) => {
    clientSocket.on('join-room', (arg) => {
      assert.equal(arg.msg, `Please wait joining loby`);
    });
    emitSuccesfullyCreated(serverSocket, true, true);
    done();
  });

  it('should emit room is full', (done) => {
    clientSocket.on('room', (arg) => {
      assert.equal(arg.msg, `This room 'roomFull' is full`);
    });
    emitRoomIsFull(serverSocket, 'roomFull', false);
    done();
  });

  /**
   * To check the message `This username 'toto' is already taken`
   * Change to beforeEach and afterEach instead of before and after
   * to test the username taken message scene.
   * Because it is emting 'room' or 'join-room' two listener in the
   * same event is conflicting.
   */
  it('should emit username is taken', (done) => {
    clientSocket.on('room', (arg) => {
      assert.equal(arg.msg, `This username 'toto' is already taken`);
    });
    emitUserNametaken(serverSocket, 'toto', false);
    done();
  });
});
