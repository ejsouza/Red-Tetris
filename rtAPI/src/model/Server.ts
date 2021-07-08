import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import { Game } from './Game';
import Room from './Room';
import Player from './Player';

import _Player from './_Player';
import _Room from './_Room';
import _Game from './_Game';
import { IPiece } from '../interfaces/piece.interface';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';
import * as roomController from '../controller/RoomController';
import {
  handlePlayerKeyDown,
  gameDifficulty,
} from '../controller/GameController';

dotenv.config();

interface IRoom {
  name: string;
  // players: Player[];
  players: _Player[];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}


interface IKeyDown {
  // key: KeyboardEvent;
  key: string;
  gameName: string;
  playerName: string;
}

export interface IFrontState {
  playerName: string;
  gameName: string;
  board: number[][];
  piece: IPiece;
  next: number[];
  score: number;
  at: number,
}

export class Server {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;
  private _rooms: Room[];
  public games: Game[];

  private __rooms: _Room[];

  constructor() {
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
    this._CLIENT_URL = process.env.CLIENT_URL;
    this.initializeServer();
    this.initializeSocketIO();
    this.listen();
    this._rooms = [];
    this.__rooms = [];
    this.games = [];
  }

  private initializeServer(): void {
    this._httpServer = htpp.createServer();
  }

  private initializeSocketIO(): void {
    this._io = new socketIO.Server(this._httpServer, {
      cors: {
        origin: this._CLIENT_URL,
        methods: ['GET', 'POST'],
      },
    });

    this._io.on('connection', (socket: socketIO.Socket) => {
      socket.on('join', (arg) => {
        // console.log(`got from client := ${arg.name} <--> ${arg.game}`);
      });

      // socket.on('start', (gameName: string, difficult: string) => {
      //   this._io.sockets.to(gameName).emit('closeStartComponent');
      //   this._io.sockets.to(gameName).emit('setGame', { start: true });
      //   const room = this._rooms.find((r) => r.name === gameName);
      //   room.open = false;
      //   // define game speed here
      //   const speed = gameDifficulty(difficult);
      //   room.newGame(this._io, socket, speed);
      // });

        socket.on('start', (gameName: string, difficult: string) => {
          this._io.sockets.to(gameName).emit('closeStartComponent');
          this._io.sockets.to(gameName).emit('setGame', { start: true });
          const room = this.__rooms.find((r) => r.name === gameName);
          console.log(`found rooom ${room.name}`);

          // room.startGame()
          const game = new _Game({
            io: this._io,
            socket,
            name: gameName,
            players: room.players,
            mode: 1,
          })
          game.start();
          room.addGame = game;
          room.isOpen  = false;
        });

      socket.on('stopGame', (gameName: string) => {
        const room = this._rooms.find((r) => r.name === gameName);
        room.gameOver();
      });

      socket.on('loser', (playerName, gameName) => {
        const room = this._rooms.find((r) => r.name === gameName);
        room.game.removePlayer(playerName);
        console.log('lose with one player => ', room.game.players.length);
        room.playersBackUp.forEach((player) =>
          console.log(`players still in room ==> ${player.name}`)
        );
      });

      socket.on('winner', (playerName, gameName) => {
        const room = this._rooms.find((r) => r.name === gameName);
        room.game.removePlayer(playerName);
        console.log(
          'winner with multiple players ==> ',
          room.game.players.length
        );
        room.playersBackUp.forEach((player) =>
          console.log(`players still in room ==> ${player.name}`)
        );
      });

           socket.on('getLobby', (name) => {
             const lobby = this.__rooms.filter((r) => r.name === name)[0];
             const r: IRoom = {
               name: lobby.name,
               open: lobby.isOpen,
               host: lobby.gameHost,
               numberOfPlayers: 1,
               players: lobby.players,
             };
             console.log(`emitting lobby ${r.host} - [${name}]`);
             socket.emit('lobby', r);
           });

      // socket.on('getLobby', (name) => {
      //   const lobby = this._rooms.filter((r) => r.name === name)[0];
      //   const r: IRoom = {
      //     name: lobby.name,
      //     players: lobby.players,
      //     open: lobby.open,
      //     numberOfPlayers: lobby.numberOfPlayers,
      //     host: lobby.host,
      //   };
      //   console.log(`emitting lobby ${r.host} - [${name}]`);
      //   socket.emit('lobby', r);
      // });

      socket.on('createRoom', (roomName) => {
        socket.join(roomName);
        socket.rooms.forEach((room) =>
          console.log(`rooms  in game ${room} - len ${room.length}`)
        );
      });

      socket.on('createOrJoinGame', (roomName: string, userName: string) => {
        console.log(`Asking to create game`);

        const room = this.__rooms.find((room) => room.name === roomName);
        if (!room) {
          // Room doesn't exist yest, create it
          this.__rooms.push(roomController._createRoom(roomName, userName, socket.id));
          roomController.emitSuccesfullyCreated(socket, true);
        } else {
          if (!room.isOpen) {
            roomController.emitRoomIsFull(socket, roomName);
            return;
          }
          const players = room.players;
          if (players.some((player) => player.name === userName)) {
            roomController.emitUserNametaken(socket, userName);
            return;
          }
              roomController._addPlayerToRoom(room, userName, socket.id);
              roomController.emitSuccesfullyCreated(socket, false);
        }
      });

      socket.on('front-state', (state: IFrontState) => {
        const room = this.__rooms.find((r) => r.name === state.gameName);
        room.game.queu(state); 
      });

      socket.on('get-extra-pieces', (gameName: string) => {
        const room = this.__rooms.find((r) => r.name === gameName);
        room.game.createNewPieces();
      });

      socket.on('apply-penalty', (gameName: string,) => {
        socket.to(gameName).emit('got-penalty')
      });

      // socket.on('createOrJoinGame', (roomName: string, userName: string) => {

      //   const room = this._rooms.find((room) => room.name === roomName);

      //   if (room === undefined) {
      //     this._rooms.push(
      //       roomController.createRoom(roomName, userName, socket.id)
      //     );
      //     // Only the first to enter the room will be host at the beginning
      //     roomController.emitSuccesfullyCreated(socket, true);
      //   } else {
      //     if (!room.open) {
      //       roomController.emitRoomIsFull(socket, roomName);
      //       return;
      //     }
      //     const players = room.players;
      //     if (players.some((player) => player.name === userName)) {
      //       roomController.emitUserNametaken(socket, userName);
      //       return;
      //     }
      //     roomController.addPlayerToRoom(room, userName, socket.id);
      //     roomController.emitSuccesfullyCreated(socket, false);
      //   }
      // });

      socket.on('keydown', (args: IKeyDown) => {
        const room = this._rooms.find((room) => room.name === args.gameName);
        const game = room?.game;
        const player = game?.players.find((p) => p.name === args.playerName);
        if (player) {
          handlePlayerKeyDown(this._io, player, args.key);
        }
      });

      return;
    });
  }

  private listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
