import * as socketIO from 'socket.io';
import Board from './Board';
import Piece from './Piece';
import { IPiece } from '../interfaces/piece.interface';
import { BOARD_HEIGHT, BOARD_WIDTH, PIECES, BLOCKED_ROW } from '../utils/const';

interface IBoard {
  shape: number[][];
  drawPiece(piece: IPiece): void;
  cleanPiece(piece: IPiece): void;
}

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

interface IPlayer {
  socketId: string;
  name: string;
  board: IBoard;
  piece: IPiece;
  nextPiece: IPiece[];
  isHost: boolean;
  score: number;
}

interface INextPiece {
  id: string;
  playerName: string;
  board: number[][];
  gameName: string;
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
  public gameName: string;

  constructor(
    socket: socketIO.Socket,
    io: socketIO.Server,
    room: IRoom,
    roomName: string
  ) {
    this.gameName = roomName;
    this.socket = socket;
    this.io = io;
    this.board = new Board();
    this.createPiece = new Piece();
    this.piece = this.createPiece.randomPiece();
    this.nextPiece = this.createPiece.randomPiece();
    this.players = [];
    this.start(room, roomName);
  }

  start = (room: IRoom, roomName: string): void => {
    this.initializeBoard(roomName);
    this.initializePlayers(room);
  };

  initializeBoard = (roomName: string): void => {
    this.board.drawPiece(this.piece);

    this.io.sockets
      .to(roomName)
      .emit('newMap', this.board.shape, this.piece, this.nextPiece);
  };

  getNextPiece = ({ id, playerName, board, gameName }: INextPiece) => {
    this.io.sockets.to(id).emit('target', id);
    const nextPiece = this.createPiece.randomPiece();
    const player = this.players.find((p) => p.name === playerName);
    player.board.shape = board;
    this.players.forEach((p) => {
      p.nextPiece.push(nextPiece);
    });

    this.io.sockets
      .to(player.socketId)
      .emit('nextPiece', player.nextPiece.shift());
  };

  initializePlayers = (room: IRoom): void => {
    this.players = room.players.map((player) => {
      let p: IPlayer = {
        socketId: player.socketId,
        name: player.name,
        board: Object.create(this.board),
        isHost: room.host === player.name,
        piece: Object.create(this.piece),
        nextPiece: [...Object.create(this.nextPiece)],
        score: 0,
      };
      return p;
    });
  };

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
