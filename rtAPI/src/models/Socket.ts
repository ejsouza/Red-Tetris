import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import { Game } from './Game';
import {
  updateBoard,
  movePiece,
  startGameInterval,
  createBoard,
  removeOldPiece,
  draw,
} from '../utils/game';

dotenv.config();

interface Piece {
  pos: { x: number; y: number }[];
  width: number;
  height: number;
  color: number;
}

export class Socket {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;
  private _data: { game: string; players: string[] }[];
  private _board: number[][];
  private _piece: Piece;

  constructor(games: { game: string; players: string[] }[]) {
    this._data = games;
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
    this._CLIENT_URL = process.env.CLIENT_URL;
    this.initializeServer();
    this.initializeSocketIO();
    this.listen();
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
        console.log(`got from client := ${arg.name} <--> ${arg.game}`);
      });

      socket.on('start', () => {
        this._io.emit('closeStartComponent');
        this._io.emit('setGame', { start: true });
        // [this._board, this._piece] = buildNewMap();
        const game = new Game(socket);
        // [this._board, this._piece] = createBoard(socket);
        // startGameInterval(socket, this._board, this._piece);
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
