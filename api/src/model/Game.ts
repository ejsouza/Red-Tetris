import Player from './Player';
import * as socketIO from 'socket.io';
import Piece from './Piece';
import { IFrontState } from './Server';

export interface IGame {
  name: string;
  players: Player[];
  mode: Mode;
  io: socketIO.Server;
  socket: socketIO.Socket;
}

enum Mode {
  Solo = 1,
  Multiplayer,
}

interface IShadow {
  player: string;
  board: number[][];
}

class Game {
  private _io: socketIO.Server;
  name: string;
  players: Player[];
  private _intervalId: NodeJS.Timeout;
  private _mode: Mode;
  private _nextPiece: number[];
  private _piece: Piece;
  private _actionQueu: IFrontState[];

  constructor(args: IGame) {
    this.name = args.name;
    this.players = args.players.map((player) => new Player(player));
    this._mode = args.mode;
    this._mode = this.players.length === 1 ? Mode.Solo : Mode.Multiplayer;
    this._io = args.io;
    this._piece = new Piece(Math.floor(Math.random() * 7)); /* 0-6 */
    this._nextPiece = this._piece.randomizer();
    this._actionQueu = [];
  }

  start() {
    const shadows: IShadow[] = [];
    this.players.forEach((player) => {
      // Use game piece color to create a new piece to each player
      player.piece = new Piece(this._piece.shape.color);
      player.appendNextPiece(this._nextPiece);
      // send first shadow to every player
      let shadow: IShadow = {
        player: player.name,
        board: player.board.shape,
      };
      shadows.push(shadow);
    });
    this.players.forEach((player) => {
      const s = shadows.filter((shaddy) => shaddy.player !== player.name);
      this._io.to(player.id).emit('arrayOfPlayers', s);
      this._io.to(player.id).emit('startLoop', this._piece.shape);
      this._io.to(player.id).emit('update-next-piece', [...this._nextPiece]);
    });
    this._intervalId = setInterval(() => {
      /**
       * Try to remove parentheses from update
       * setInterval(this._update, 1000);
       */
      this.update();
    }, 1000);
  }

  gameOver() {
    clearInterval(this._intervalId);
    this._io.to(this.name).emit('game-is-over');
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }
  removePlayer(playerName: string) {
    const index = this.players.map((player) => player.name).indexOf(playerName);
    /**
     * If no player was found indexOf will return -1
     * Passing a negative index to splice() will make it start
     * from the end of the array
     * (If negative, it will begin that many elements from the end of the array.)
     */
    if (index < 0) {
      return false;
    }
    this.players.splice(index, 1);
  }

  queue(state: IFrontState) {
    this._actionQueu.push(state);
  }

  eraseQueue() {
    this._actionQueu.splice(0, this._actionQueu.length);
  }
  createNewPieces() {
    const newPieces = this._piece.randomizer();

    /* to all players in game */
    this._io.to(this.name).emit('extra-pieces', [...newPieces]);
  }

  getQueueLen() {
    return this._actionQueu.length;
  }

  /**
   * 	CLIENT SIDE PREDICTION AND SERVER RECONCILIATION
   * 	https://www.gabrielgambetta.com/
   */
  update() {
    // this.frontStateListener();
    const tenFirstStates = this._actionQueu.splice(0, 10);
    this.players.forEach((player) => {
      const playerState = tenFirstStates.filter(
        (action) => action.playerName === player.name
      );
      if (playerState.length) {
        // set array to an empty array
        player.nextPiece.splice(0, player.nextPiece.length);
        /* If more than one state for same player take last added */
        const state = playerState[playerState.length - 1];
        player.nextPiece = [...state.next];

        player.boardShape = [...state.board];
        player.piece.shape = JSON.parse(JSON.stringify(state.piece));
        const shaddy: IShadow = {
          player: player.name,
          board: player.board.shape,
        };
        this.players.forEach((p) => {
          if (p.name !== player.name) {
            this._io.to(p.id).emit('arrayOfPlayer', shaddy);
          }
        });
      }
      /**
       * This only happens if a player close his/her tab while
       * game is on going.
       */
      if (this.players.length === 1 && this._mode > 1) {
        this._io
          .to(player.id)
          .emit('youWin', { gameOver: true, multiplayer: this._mode });
        this.gameOver();
      }
      if (player.isThirdRowReached()) {
        player.lost = true;
        player.gameLostAt = Date.now();
        if (this.players.length === 1) {
          // Only one player game over
          this._io
            .to(player.id)
            .emit('youLost', { gameOver: true, multiplayer: this._mode });
          this.gameOver();
          return;
        }
        const playersInGame = this.players.filter((player) => !player.lost);
        if (playersInGame?.length > 1) {
          /** If player is the 3th or 4th player in game
           *  just emit to him  and set him to hasLost true
           */
          this._io
            .to(player.id)
            .emit('youLost', { gameOver: false, multiplayer: this._mode });
        } else {
          playersInGame[0]?.resetBoard();
          if (
            playersInGame.length === 1 ||
            playersInGame[0]?.gameLostAt > player.gameLostAt
          ) {
            this._io
              .to(playersInGame[0]?.id)
              .emit('youWin', { multiplayer: this._mode });
            this._io
              .to(player.id)
              .emit('youLost', { gameOver: true, multiplayer: this._mode });
          } else {
            this._io.to(player.id).emit('youWin', { multiplayer: this._mode });
            this._io
              .to(playersInGame[0]?.id)
              .emit('youLost', { gameOver: true });
          }
          this.gameOver();
        }
      }
    });
  }
}

export default Game;
