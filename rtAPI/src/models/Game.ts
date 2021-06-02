import * as socketIO from 'socket.io';
import { Board } from './Board';
import { Piece } from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import { BOARD_HEIGHT, BOARD_WIDTH, PIECES, BLOCKED_ROW } from '../utils/const';

interface IBoard {
  shape: number[][];
  drawPiece(piece: IPiece): void;
  cleanPiece(piece: IPiece): void;
}

interface IRoom {
  name: string;
  // players: string[];
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

interface IPlayer {
  socketId: string;
  name: string;
  board: IBoard;
  piece: IPiece;
  nextPiece: IPiece[];
  isHost: boolean;
  score: number;
}

export class Game {
  public socket: socketIO.Socket;
  public io: socketIO.Server;
  public board: IBoard;
  public piece: IPiece;
  public nextPiece: IPiece;
  public createPiece: Piece;
  private _room: IRoom;
  public players: IPlayer[];

  constructor(
    socket: socketIO.Socket,
    io: socketIO.Server,
    room: IRoom[],
    roomName: string
  ) {
    this.socket = socket;
    this.io = io;
    this.board = new Board();
    this.createPiece = new Piece();
    this.piece = this.createPiece.randomPiece();
    this.nextPiece = this.createPiece.randomPiece();
    this.players = [];
    this.start(room, roomName);
  }

  start = (room: IRoom[], roomName: string): void => {
    this.initializeBoard(roomName);
    // this.startGameInterval();
    this.initializePlayers(room);
    this.events();
    this.printUsersInGame();
  };

  printUsersInGame = () => {
    this.players.forEach((p) => console.log(' ???', p.name))
  }

  initializeBoard = (roomName: string): void => {
    this.board.drawPiece(this.piece);

    this.io.sockets
      .to(roomName)
      .emit('newMap', this.board.shape, this.piece, this.nextPiece);
  };

  getNextPiece = (id: string, playerName: string) => {
    this.io.sockets.to(id).emit('target', id);

     const nextPiece = this.createPiece.randomPiece();
     // this.nextPiece = nextPiece;
     const player = this.players.find((p) => p.name === playerName);
     this.players.forEach((p) => {
      //  console.log(`pushing nextPiece to ${p.name}`);
       p.nextPiece.push(nextPiece);
     });

     // player.nextPiece.push(nextPiece);
     // this.socket.emit('nextPiece', nextPiece);
     this.io.sockets
       .to(player.socketId)
       .emit('nextPiece', player.nextPiece.shift());
  };
  initializePlayers = (room: IRoom[]): void => {
    room.forEach((r) => {
      r.players.forEach((player) => {
        let p: IPlayer = {
          socketId: player.socketId,
          name: player.name,
          board: this.board,
          isHost: r.name === player.name,
          nextPiece: [this.nextPiece],
          piece: this.piece,
          score: 0,
        };
        this.players.push(p);
      });
    });
    // this.players.forEach((player) =>
    //   console.log(`PLAYER := ${player.name} id := ${player.socketId}`)
    // );
  };

  /** ---- TEST LOOP ON THE FRONT ---- */

  events = (): void => {
    // this.socket.on('getNextPiece', (args) => {
    //   const nextPiece = this.createPiece.randomPiece();
    //   // this.nextPiece = nextPiece;
    //   const player = this.players.find((p) => p.name === args.playerName);
    //   this.players.every((p) => {
    //     p.nextPiece.push(nextPiece);
    //   });

    //   console.log(`PLAYER WAS FOUND ?? ${player.name} - ${player.socketId}`);
    //   // player.nextPiece.push(nextPiece);
    //   console.log(`piece will be emited only for player ${args.playerName}`);
    //   // this.socket.emit('nextPiece', nextPiece);
    //   this.io.sockets
    //     .to(player.socketId)
    //     .emit('nextPiece', player.nextPiece.shift());
    // });
  };

  /** ---- ENT TESTING ---- */

  newPiece = (): void => {
    this.nextPiece = this.createPiece.randomPiece();
  };

  isNextXRowFree = (): boolean => {
    let isFree = true;
    this.board.cleanPiece(this.piece);
    this.piece.pos.forEach((pos) => {
      if (
        pos.y + 1 >= BOARD_HEIGHT ||
        this.board.shape[pos.y + 1][pos.x] !== 0
      ) {
        isFree = false;
        this.board.drawPiece(this.piece);
        return;
      }
    });
    return isFree;
  };

  gameLoop = (): boolean => {
    if (!this.isNextXRowFree()) {
      return true;
    }

    this.board.cleanPiece(this.piece);
    this.piece.pos.forEach((pos) => {
      pos.y++;
      this.board.shape[pos.y][pos.x] = this.piece.color;
    });
    return false;
  };

  isGameOver = (): boolean => {
    let gameOver = BOARD_HEIGHT;
    this.piece.pos.forEach((pos) => {
      if (pos.y < gameOver) {
        gameOver = pos.y;
      }
    });
    return gameOver < this.piece.height;
  };
}
