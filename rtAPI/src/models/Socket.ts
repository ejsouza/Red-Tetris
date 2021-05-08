import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import { Game } from './Game';

dotenv.config();

export class Socket {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;
  private _data: { game: string; players: string[] }[];

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
      console.log(`SOCKETIO running... ${socket}`);

      socket.on('join', (arg) => {
        console.log(`got from client := ${arg.name} <--> ${arg.game}`);
      });

      socket.on('start', () => {
        this._io.emit('closeStartComponent');
        const  game = new  Game(this._io, socket);
        game.start();
        game.on();
      });
      socket.on('joinDetails', (arg: { name: string; room: string }) => {
        const simple = {
          game: arg.room,
          players: [arg.name],
        };
        console.log(`new user ${arg.name} in  room ${arg.room}`);
        this._data.push(simple);
        console.log(`added? ${this._data}`);
        console.log(`obje len := ${this._data.length}`);
        for (let d of this._data) {
          console.log(
            `d := ${d} -- d.game := ${d.game} -- d.players := ${d.players}`
          );
        }
        socket.emit('joinDetails', { success: true });
      });
    });
  }

  private listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
