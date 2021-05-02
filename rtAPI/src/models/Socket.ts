import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';

export class Socket {
  private _httpServer: htpp.Server;
  private _io: socketIO.Server;
  private _PORT: number;

  constructor() {
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
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
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this._io.on('connection', (socket: socketIO.Socket) => {
      console.log(`SOCKETIO running... ${socket}`);

      socket.on('join', (arg) => {
        console.log(`got from client := ${arg.name}`);
      });
    });
  }

  private listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
