import * as htpp from 'http';
import * as socketIO from 'socket.io';
import * as dotenv from 'dotenv';
import Player from './Player';
import Room from './Room';
import Game from './Game';
import { IPiece } from '../interfaces/piece.interface';
import { MAX_NUMBER_OF_PLAYERS } from '../utils/const';
import * as roomController from '../controller/RoomController';
import { gameDifficulty } from '../controller/GameController';

dotenv.config();

interface IRoom {
  name: string;
  players: Player[];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

interface IOpenRoom {
  name: string;
  players: string[];
}

export interface IFrontState {
  playerName: string;
  gameName: string;
  board: number[][];
  piece: IPiece;
  next: number[];
  score: number;
  at: number;
}

export class Server {
  _httpServer: htpp.Server;
  _io: socketIO.Server;
  private _PORT: number;
  private _CLIENT_URL: string;

  rooms: Room[];

  constructor() {
    this._PORT = Number.parseInt(process.env.PORT, 10) || 5000;
    this._CLIENT_URL = process.env.CLIENT_URL;
    this.initializeServer();
    this.initializeSocketIO();
    this.listen();
    this.rooms = [];
  }

  private initializeServer(): void {
    this._httpServer = htpp.createServer();
  }

  private initializeSocketIO(): void {
    this._io = new socketIO.Server(this._httpServer, {
      cors: {
        // origin: this._CLIENT_URL,
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this._io.on('connection', (socket: socketIO.Socket) => {
      socket.on('join', (arg) => {});

      socket.on('disconnect', () => {
        this.rooms.forEach((room) => {
          room?.game?.players.forEach((player) => {
            if (player.id === socket.id) {
              this._io
                .to(room.name)
                .emit('player-closed-tab', player.name, room.name);
            }
          });
        });
      });

      socket.on('start', (gameName: string, difficult: string) => {
        const room = this.rooms.find((r) => r.name === gameName);
        this._io.to(gameName).emit('set-difficulty', gameDifficulty(difficult));
        if (!room.game) {
          const game = new Game({
            io: this._io,
            socket,
            name: gameName,
            players: room.players,
            mode: 1,
          });
          room.addGame = game;
        } else {
          room.game.players.forEach((player) => player.resetBoard());
        }
        room.game?.players.forEach((player) => {
          this._io.to(player.id).emit('game-host', player.isHost);
          this._io.to(player.id).emit('closeStartComponent');
          this._io.to(player.id).emit('setGame', { start: true });
        });
        room.isOpen = false;
        room.game?.start();
      });

      socket.on('getLobby', (name) => {
        const lobby = this.rooms.find((r) => r.name === name);
        const r: IRoom = {
          name: lobby?.name,
          open: lobby?.isOpen,
          host: lobby?.gameHost,
          numberOfPlayers: lobby?.players?.length,
          players: lobby?.players,
        };
        const gameHost = lobby?.players?.find((player) => player.isHost);
        if (gameHost) {
          this._io.to(gameHost.id).emit('game-host', true);
        }
        lobby.players?.forEach((player) => {
          this._io.to(player.id).emit('lobby', r);
        });
      });

      socket.on('createRoom', (roomName) => {
        socket.join(roomName);
      });

      socket.on(
        'createOrJoinGame',
        (roomName: string, userName: string, join: boolean) => {
          const room = this.rooms.find((room) => room.name === roomName);
          if (!room) {
            // Room doesn't exist yest, create it
            this.rooms.push(
              roomController.createRoom(roomName, userName, socket.id)
            );
            roomController.emitSuccesfullyCreated(socket, true, join);
          } else {
            if (!room.isOpen) {
              roomController.emitRoomIsFull(socket, roomName, join);
              return;
            }
            const players = room.players;
            if (players.some((player) => player.name === userName)) {
              roomController.emitUserNametaken(socket, userName, join);
              return;
            }
            roomController.addPlayerToRoom(room, userName, socket.id);
            roomController.emitSuccesfullyCreated(socket, false, join);
          }
        }
      );

      socket.on('search-games', () => {
        const openRoom: IOpenRoom[] = [];

        this.rooms.forEach((room) => {
          if (room.isOpen) {
            const openR: IOpenRoom = {
              name: room.name,
              players: room.players.map((player) => player.name),
            };
            openRoom.push(openR);
          }
        });
        this._io.to(socket.id).emit('games-open', openRoom);
      });

      socket.on('front-state', (state: IFrontState) => {
        const room = this.rooms.find((r) => r.name === state.gameName);
        room?.game?.queue(state);
      });

      socket.on('get-extra-pieces', (gameName: string) => {
        const room = this.rooms.find((r) => r.name === gameName);
        room.game.createNewPieces();
      });

      socket.on('apply-penalty', (gameName: string, playerName: string) => {
        const room = this.rooms.find((r) => r.name === gameName);
        const playersInGame = room.game.players.filter(
          (player) => !player.lost && player.name !== playerName
        );
        playersInGame.forEach((player) => {
          this._io.to(player.id).emit('got-penalty');
        });
      });

      socket.on('restart-game', (gameName: string, playerName: string) => {
        const room = this.rooms.find((r) => r.name === gameName);
        room.isOpen = room?.game?.players.length < MAX_NUMBER_OF_PLAYERS;
        room.players.forEach((player) => {
          /* Reset player store */
          player.resetBoard();
          const resetUser = {
            board: player.board.shape,
            isHost: player.isHost,
            level: 0,
            score: 0,
          };
          this._io.to(player.id).emit('prepare-for-next-game', resetUser);
        });
      });

      socket.on('player-quit', (gameName: string, playerName: string) => {
        const room = this.rooms.find((r) => r.name === gameName);
        const player = room?.players?.find(
          (player) => player.name === playerName
        );

        if (player) {
          player.resetBoard();
          /* Reset player store */
          const resetUser = {
            board: player.board.shape,
            isHost: false,
            level: 0,
            score: 0,
          };
          this._io.to(player.id).emit('reset', resetUser);
        }
        room.removePlayer(playerName);
        room.game.removePlayer(playerName);
        if (!room.players.length) {
          const index = this.rooms.map((room) => room.name).indexOf(gameName);
          if (index < 0) {
            return;
          }
          this.rooms.splice(index, 1);
        } else {
          /* Setting new host only in room doesn't apply to player in game
           * so it is set in both game and room
           */
          const newGameHost = room.players.find((player) => player.isHost);
          const gameHost = room.game.players.find(
            (player) => player.name === newGameHost.name
          );
          gameHost.isHost = true;
          if (newGameHost) {
            this._io.to(newGameHost.id).emit('game-host', true);
          }
        }
      });

      return;
    });
  }

  listen(): void {
    this._httpServer.listen(this._PORT);
  }
}
