import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import { Game } from './Game';
import Room from './Room';
import Player from './Player';
import { IPiece } from '../interfaces/piece.interface';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';
import * as roomController from '../controller/RoomController';
import { handlePlayerKeyDown } from '../controller/GameController';

dotenv.config();

interface IRoom {
  name: string;
  // players: [
  //   {
  //     name: string;
  //     socketId: string;
  //   }
  // ];
  players: Player[];
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

export class Server {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;
  private _rooms: Room[];
  public games: Game[];

  constructor() {
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
    this._CLIENT_URL = process.env.CLIENT_URL;
    this.initializeServer();
    this.initializeSocketIO();
    this.listen();
    this._rooms = [];
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

      socket.on('start', (arg) => {
        this._io.sockets.to(arg.name).emit('closeStartComponent');
        this._io.sockets.to(arg.name).emit('setGame', { start: true });
        const room = this._rooms.find((r) => r.name === arg.name);
        room.open = false;
        room.newGame(this._io, socket);
        // const game = new Game(socket, this._io, room, arg.name);
        // this.games.push(game);
      });

      socket.on('stopGame', (gameName: string) => {
        const room = this._rooms.find((r) => r.name === gameName);
        room.gameOver();
      });

      socket.on('getNextPiece', (args) => {
        // const game = this.games.find((game) => game.gameName === args.gameName);
        // game.getNextPiece({
        //   id: socket.id,
        //   playerName: args.playerName,
        //   board: args.boardState,
        //   gameName: args.gameName,
        // });
        // const player = game.players.find((p) => p.name === args.playerName);
        // player.board.shape = args.boardState;
        // // sending to all clients in 'game' room(channel) except sender
        // socket.broadcast.to(args.gameName).emit('shaddy');
      });

      socket.on('getArrayOfPlayers', (gameName: string, playerName: string) => {
        // const shadows: IShadow[] = [];
        // const game = this.games.find((game) => game.gameName === gameName);
        // game.players.forEach((player) => {
        //   if (player.name !== playerName) {
        //     let shade: IShadow = {
        //       player: player.name,
        //       board: player.board.shape,
        //     };
        //     shadows.push(shade);
        //   }
        // });
        // this._io.sockets.to(socket.id).emit('arrayOfPlayers', shadows);
      });

      socket.on('getLobby', (name) => {
        const lobby = this._rooms.filter((r) => r.name === name)[0];
        const r: IRoom = {
          name: lobby.name,
          players: lobby.players,
          open: lobby.open,
          numberOfPlayers: lobby.numberOfPlayers,
          host: lobby.host,
        };
        socket.emit('lobby', r);
      });

      socket.on('createRoom', (roomName) => {
        socket.join(roomName);
      });

      socket.on('createOrJoinGame', (roomName: string, userName: string) => {
        const room = this._rooms.find((room) => room.name === roomName);

        if (room === undefined) {
          this._rooms.push(
            roomController.createRoom(roomName, userName, socket.id)
          );
          roomController.emitSuccesfullyCreated(socket);
        } else {
          if (!room.open) {
            roomController.emitRoomIsFull(socket, roomName);
            return;
          }
          const players = room.players;
          if (players.some((player) => player.name === userName)) {
            roomController.emitUserNametaken(socket, userName);
            return;
          }
          roomController.addPlayerToRoom(room, userName, socket.id);
          roomController.emitSuccesfullyCreated(socket);
        }
      });

      socket.on('keydown', (args: IKeyDown) => {
        const room = this._rooms.find((room) => room.name === args.gameName);
        const player = room.players.find((p) => p.name === args.playerName);
        handlePlayerKeyDown(this._io, player, args.key);
      });
      socket.on('applyPenalty', (gameName) => {
        // console.log(`applyPenalty called 🚨`);
        // socket.on('updateMove', () => console.log(`update this`));
        // socket.broadcast.to(gameName).emit('penalty');
      });

      socket.on('gameOver', (args) => {
        // const game = this.games.find((game) => game.gameName === args.gameName);
        // const player = game.players.find(
        //   (player) => player.name === args.playerName
        // );
        // player.board.shape = args.boardState;
        // // START Handle send last version of a map when game over
        // const myBoardShadow: IShadow = {
        //   player: args.playerName,
        //   board: args.boardState,
        // };
        // // socket.broadcast.to(args.gameName).emit('player', myBoardShadow);
        // socket.broadcast.to(args.gameName).emit('shaddy');
        // END Handle send last version of a map when game over
      });
      return;
    });
  }

  private listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
