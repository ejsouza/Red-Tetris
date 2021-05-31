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
  players: string[];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

interface IPlayer {
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
  };

  initializeBoard = (roomName: string): void => {
    this.board.drawPiece(this.piece);

    console.log(`<<<?>>> ${this.io.sockets.adapter.rooms.get(roomName).size}`);
    // this.socket.emit('newMap', this.board.shape, this.piece, this.nextPiece);
    // this.io.sockets
    //   .to(roomName)
    //   .emit('newMap', this.board.shape, this.piece, this.nextPiece);

    this.io.sockets
      .in(roomName)
      .emit('newMap', this.board.shape, this.piece, this.nextPiece);

  };

  initializePlayers = (room: IRoom[]): void => {
    console.log(`Got game ${room}`);
    room.forEach((r) => {
      r.players.forEach((player) => {
        let p: IPlayer = {
          name: player,
          board: this.board,
          isHost: r.name === player,
          nextPiece: [this.nextPiece],
          piece: this.piece,
          score: 0,
        };
        this.players.push(p);
      });
    });
    this.players.forEach((player) => console.log(`PLAYER := ${player.name}`));
  };

  /** ---- TEST LOOP ON THE FRONT ---- */

  events = (): void => {
    this.socket.on('getNextPiece', () => {
      const nextPiece = this.createPiece.randomPiece();
      this.nextPiece = nextPiece;
      this.socket.emit('nextPiece', nextPiece);
    });
  };

  /** ---- ENT TESTING ---- */

  // startGameInterval = (): void => {
  //   this.socket.on('keydown', ({  piece  }) => {
  //     this.board.cleanPiece(this.piece);
  //     this.piece = piece;
  //     this.board.drawPiece(this.piece);
  //     this.socket.emit('gameState', this.board.shape, this.piece);
  //   });
  //   const interval = setInterval(() => {
  //     const winner = this.gameLoop();
  //     if (!winner) {
  //       this.socket.emit('gameState', this.board.shape, this.piece);
  //     } else {
  //       if (this.isGameOver()) {
  //         this.socket.emit('gameOver');
  //         clearInterval(interval);
  //       } else {
  //         // let height = BOARD_HEIGHT - 1;
  //         let max = 0;
  //         let min = BOARD_HEIGHT;
  //         this.piece.pos.forEach((pos) => {
  //           max = pos.y > max ? pos.y : max;
  //           min = pos.y < min ? pos.y : min;
  //         });
  //         let height = max;

  //         while (height >= min) {
  //           let count = 0;

  //           for (let col = 0; col < BOARD_WIDTH; col++) {
  //             if (this.board.shape[height][col] === BLOCKED_ROW) {
  //               break;
  //             }
  //             if (this.board.shape[height][col] !== 0) {
  //               count++;
  //             }
  //           }
  //           if (count === BOARD_WIDTH) {
  //             for (let col = 0; col < BOARD_WIDTH; col++) {
  //               this.board.shape[height][col] = 0;
  //             }
  //             for (let h = height; h > 0; h--) {
  //               for (let col = 0; col < BOARD_WIDTH; col++) {
  //                 this.board.shape[h][col] = this.board.shape[h - 1][col];
  //               }
  //             }
  //             height++;
  //           }
  //           height--;
  //         }
  //         /**
  //          * ATENTION 🚨
  //          * the value of this.piece has to be set  in this else
  //          * and cannot be moved elsewhere, like inside this.newPiece()
  //          */
  //         /**
  //          * DO NOT 👉 this.piece = this.nextPiece;
  //          * it will only copy the same reference and share the same address
  //          */
  //         this.nextPiece.pos.forEach((pos, index) => {
  //           this.piece.pos[index].y = pos.y;
  //           this.piece.pos[index].x = pos.x;
  //         });
  //         this.piece.color = this.nextPiece.color;
  //         this.piece.height = this.nextPiece.height;
  //         this.piece.width = this.nextPiece.width;
  //         /**
  //          * Even though is seems that the drawing should come before
  //          * it is not the case
  //          * it need to come after, otherwise piece will start on row 1
  //          * instead of row 0
  //          */
  //         this.board.drawPiece(this.piece);
  //         this.socket.emit('gameState', this.board.shape, this.piece);
  //         this.newPiece();
  //       }
  //     }
  //   }, (900 * 60) / 100);
  // };

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
