import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import { Game } from './Game';
import { IPiece } from '../interfaces/piece.interface';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';

dotenv.config();

interface IRoom {
  name: string;
  players: [
    {
      name: string;
      socketId: string;
    }
  ];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

interface IShadow {
  player: string;
  board: number[][];
}

export class Server {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;
  private _data: { game: string; players: string[] }[];
  private _board: number[][];
  private _piece: IPiece;
  private _room: IRoom[];
  public game: Game[];

  constructor() {
    this._data = [];
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
    this._CLIENT_URL = process.env.CLIENT_URL;
    this.initializeServer();
    this.initializeSocketIO();
    this.listen();
    this._room = [];
    this.game = [];
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
        const room = this._room.find((r) => r.name === arg.name);
        room.open = false;
        const game = new Game(socket, this._io, room, arg.name);
        this.game.push(game);
      });

      socket.on('getNextPiece', (args) => {
        const game = this.game.find((game) => game.gameName === args.gameName);
        game.getNextPiece({
          id: socket.id,
          playerName: args.playerName,
          board: args.boardState,
          gameName: args.gameName,
        });

        const player = game.players.find((p) => p.name === args.playerName);
        player.board.shape = args.boardState;
        // sending to all clients in 'game' room(channel) except sender
        socket.broadcast.to(args.gameName).emit('shaddy');
      });

      socket.on('getArrayOfPlayers', (gameName: string, playerName: string) => {
        const shadows: IShadow[] = [];
        const game = this.game.find((game) => game.gameName === gameName);
        game.players.forEach((player) => {
          if (player.name !== playerName) {
            let shade: IShadow = {
              player: player.name,
              board: player.board.shape,
            };
            shadows.push(shade);
          }
        });

        this._io.sockets.to(socket.id).emit('arrayOfPlayers', shadows);
      });

      socket.on('getLobby', (name) => {
        const lobby = this._room.filter((r) => r.name === name)[0];
        socket.emit('lobby', lobby);
      });

      socket.on('createRoom', (roomName) => {
        socket.join(roomName);
      });

      socket.on('createOrJoinGame', (roomName, userName) => {
        // Check if room exist or have a player with same username
        if (this._room.some((r) => r.name === roomName)) {
          // check if player can join
          let room = this._room.filter((r) => r.name === roomName)[0];
          console.log(`found  room ${room.name}`);
          let userNameTaken = false;
          room.players.forEach((p) => {
            if (p.name === userName) {
              userNameTaken = true;
              return;
            }
          });
          if (userNameTaken) {
            socket.emit('room', {
              success: false,
              msg: `This username '${userName}' is already taken`,
            });
          } else {
            let isFull = true;
            this._room.forEach((room) => {
              if (
                room.name === roomName &&
                room.open &&
                room.numberOfPlayers < MAX_NUMBER_OF_PLAYERS
              ) {
                // socket.on('createRoom', (roomName) => {
                //   socket.join(roomName);
                // });
                room.players.push({ name: userName, socketId: socket.id });
                room.numberOfPlayers++;
                isFull = false;
                socket.emit('room', {
                  success: true,
                  msg: `Please wait joining loby`,
                });
                return;
              }
            });
            if (isFull) {
              socket.emit('room', {
                success: false,
                msg: `This room '${roomName}' is full`,
              });
            }
          }
        } else {
          const room: IRoom = {
            name: roomName,
            open: true,
            numberOfPlayers: 1,
            host: userName,
            players: [
              {
                name: userName,
                socketId: socket.id,
              },
            ],
          };
          this._room.push(room);
          // socket.on('createRoom', (roomName) => {
          //   socket.join(roomName);
          // });
          socket.emit('room', {
            success: true,
            msg: `Please wait joining loby`,
          });
        }

        console.log(this._room);
      });

      socket.on('applyPenalty', (gameName) => {
        console.log(`applyPenalty called 🚨`);

        socket.on('updateMove', () => console.log(`update this`));
        socket.broadcast.to(gameName).emit('penalty');
      });

      socket.on('gameOver', (args) => {
        const game = this.game.find((game) => game.gameName === args.gameName);
        const player = game.players.find(
          (player) => player.name === args.playerName
        );
        player.board.shape = args.boardState;
        // START Handle send last version of a map when game over
        const myBoardShadow: IShadow = {
          player: args.playerName,
          board: args.boardState,
        };
        // socket.broadcast.to(args.gameName).emit('player', myBoardShadow);
        socket.broadcast.to(args.gameName).emit('shaddy');
        // END Handle send last version of a map when game over
      });
      return;
    });
  }

  private listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
