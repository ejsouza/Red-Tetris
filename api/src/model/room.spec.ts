let chaI = require('chai');
let chaiHttp = require('chai-http');
let { createServer } = require('http');
let { Server } = require('socket.io');
let Client = require('socket.io-client');
import Room from './Room';
import Game from './Game';
import Player from './Player';

chaI.use(chaiHttp);

describe('Room Model', () => {
  let player: Player;
  let room: Room;
  let game: Game;

  let io, serverSocket, clientSocket;
  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);

    player = new Player({
      name: 'nightmare',
      id: '424242',
      isHost: true,
      roomName: 'room42',
    });

    room = new Room({
      name: 'room42',
      isOpen: true,
      gameHost: 'nightmare',
      players: [player],
      numberOfPlayers: 3,
    });

    httpServer.listen(() => {
      const port = httpServer.address().port;
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

  after(() => {
    io.close();
    clientSocket.close();
  });

  it('should set room to close', () => {
    room.isOpen = false;
    chaI.expect(room.isOpen).to.be.equal(false);
  });

  it('should return game host', () => {
    chaI.expect(room.gameHost).to.be.equal('nightmare');
  });

  it('should set game host', () => {
    room.gameHost = 'Godsmack';
    chaI.expect(room.gameHost).to.be.equal('Godsmack');
  });

  it('shoule set game', () => {
    room.addGame = game;
  });

  it('should add the 4th player', () => {
    const player = new Player({
      name: 'Sail',
      id: '414141',
      isHost: false,
      roomName: 'room42',
    });
    room.addPlayer(player);
    chaI.expect(room.isOpen).to.be.equal(false);
  });

  it('should remove host', () => {
    room.gameHost = 'nightmare';
    room.removePlayer('nightmare');
    chaI.expect(room.gameHost).to.be.equal('Sail');
  });
});
