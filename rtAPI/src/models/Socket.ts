import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import { Game } from './Game';
import {
  startGameInterval,
  createBoard,
  draw,
} from '../utils/game';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const'

dotenv.config();

interface Piece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

interface IRoom {
  name: string;
  players: string[];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

export class Socket {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;
  private _data: { game: string; players: string[] }[];
  private _board: number[][];
  private _piece: Piece;
  private _room: IRoom[];

  constructor() {
    this._data = [];
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
    this._CLIENT_URL = process.env.CLIENT_URL;
    this.initializeServer();
    this.initializeSocketIO();
    this.listen();
    this._room = [];
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
        this._io.emit('closeStartComponent');
        this._io.emit('setGame', { start: true });
        console.log(`ROM NAME >>> ${arg.name}`);
        
        new Game(socket, this._io, this._room, arg.name);
       
      });

      socket.on('getLobby', (name) => { 
        const lobby = this._room.filter(r => r.name === name)[0];
        socket.emit('lobby', lobby);
        console.log(`WHAT IS THE ID ${socket.id}`);
        // socket.to(`${name}`).emit('lobby', lobby);
      })
      socket.on('createOrJoinGame', (roomName, userName) => {
        // Check if room exist or have a player with same username
        if (this._room.some(r => r.name === roomName)) {
          // check if player can join
          let room = this._room.filter(r => r.name === roomName)[0];
          if (room.players.includes(userName)) {
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
                 socket.on('createRoom', (roomName) => {
                   socket.join(roomName);
                 });
                room.players.push(userName);
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
                  msg: `This room '${userName}' is full`,
                });
            }
          }
        } else {
          const room: IRoom = {
            name: roomName,
            open: true,
            numberOfPlayers: 1,
            host: userName,
            players: [userName],
          };
          this._room.push(room);
           socket.on('createRoom', (roomName) => {
             socket.join(roomName);
           });
          socket.emit('room', {
            success: true,
            msg: `Please wait joining loby`,
          });
         
        }
      
        console.log(this._room)
      });

      socket.on('updateMove', () => console.log(`update this`));

      // socket.on('getGameMap', () => {
      //   [this._board, this._piece] = buildNewMap();
      //   this._io.emit('newMap', this._board, this._piece);
      // });

      // socket.on('updateMap', (board: number[][], piece: Piece, delay: Date) => {
      //   [this._board, this._piece] = updateBoard(board, piece);
      //   setTimeout(() => {
      //     this._io.emit('mapUpdated', this._board, this._piece);
      //     console.log(`PIECE.X := ${piece.x} PIECE.Y := ${piece.y} -- ${Date.now() - delay}`);
      //   }, (1000 * 60 ) / 60, );
      // });

      // // Listen for move piece
      // socket.on(
      //   'move',
      //   (board: number[][], piece: Piece, direction: number) => {
      //     [this._board, this._piece] = movePiece(
      //       board,
      //       piece,
      //       direction
      //     );
      //     process.nextTick(() => {
      //       this._io.emit('updateMove', this._board, this._piece);
      //     });
      //   }
      // );

      // socket.on('joinDetails', (arg: { name: string; room: string }) => {
      //   const simple = {
      //     game: arg.room,
      //     players: [arg.name],
      //   };
      //   console.log(`new user ${arg.name} in  room ${arg.room}`);
      //   this._data.push(simple);
      //   console.log(`added? ${this._data}`);
      //   console.log(`obje len := ${this._data.length}`);
      //   for (let d of this._data) {
      //     console.log(
      //       `d := ${d} -- d.game := ${d.game} -- d.players := ${d.players}`
      //     );
      //   }
      //   socket.emit('joinDetails', { success: true });
      // });

      return;
    });
  }

  private listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
