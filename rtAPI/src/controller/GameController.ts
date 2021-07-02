import * as socketIO from 'socket.io';
import Player from '../model/Player';
import Piece from '../model/Piece';
import { IShadow } from '../interfaces/';
import {
  KEY_ARROW_UP_PRESSED,
  KEY_ARROW_RIGHT_PRESSED,
  KEY_ARROW_DOWN_PRESSED,
  KEY_ARROW_LEFT_PRESSED,
  KEY_ARROW_SPACE_PRESSED,
  RECRUIT,
  VETERAN,
  HARDCORE,
  INSANE,
} from '../utils/const';

const updatePlayers = (
  io: socketIO.Server,
  socket: socketIO.Socket,
  players: Player[],
  gameName: string,
  newNextPiece: Piece
): void => {
  players.forEach((player) => {
    if (player.pieceCanFall()) {
      // piece was already cleaned inside instance, just increment and draw() it here
      player.pieceIncrementY();
      player.draw();
    } else {
      if (player.isGameOver()) {
        // set player to lost
        player.hasLost = true;
        // stop game here
        if (gameOver(players)) {
          io.to(player.socketId).emit('youLost');
        }
        emitUpdatePlayerSpectrum(io, players, player);
      } else {
        // Push a new nextPiece to each user in game
        const nextPiece = newNextPiece.randomPiece();
        const points = player.scores();
        if (points) {
          io.to(player.socketId).emit('score', player.score);
        }
        players.forEach((p) => {
          if (points && p.name !== player.name && !p.hasLost) {
            p.penalty();
          }
          p.updateNextPiece = nextPiece;
        });
        //*****************************************
        // Set current piece to nextPiece
        player.getNextPiece();
        // Send current player nextPiece
        io.to(player.socketId).emit('gameInfo', player.showNextPiece);
        emitUpdatePlayerSpectrum(io, players, player);
      }
    }
    io.to(player.socketId).emit('updateBoard', player.board.shape, player.name);
  });
};

const handlePlayerKeyDown = (
  io: socketIO.Server,
  player: Player,
  key: string
) => {
  switch (key) {
    case KEY_ARROW_UP_PRESSED:
      if (player.rotatePiece()) {
        emitUpdateBoard(io, player);
      }
      break;
    case KEY_ARROW_RIGHT_PRESSED:
      if (player.moveRight()) {
        emitUpdateBoard(io, player);
      }
      break;
    case KEY_ARROW_DOWN_PRESSED:
      if (player.moveDown()) {
        emitUpdateBoard(io, player);
      }
      break;
    case KEY_ARROW_LEFT_PRESSED:
      if (player.moveLeft()) {
        emitUpdateBoard(io, player);
      }
      break;
    case KEY_ARROW_SPACE_PRESSED:
      player.fall();
      break;
    default:
      break;
  }
};

const gameOver = (players: Player[]): boolean => {
  let playerInGame = 0;
  players.forEach((player) => {
    if (!player.hasLost) {
      playerInGame++;
    }
  });
  return playerInGame < 2;
};

const emitUpdateBoard = (io: socketIO.Server, player: Player): void => {
  io.to(player.socketId).emit('updateBoard', player.board.shape, player.name);
};

const emitUpdatePlayerSpectrum = (
  io: socketIO.Server,
  players: Player[],
  player: Player
): void => {
  const shadow: IShadow = {
    player: player.name,
    board: player.board.shape,
  };
  // Send current player board shadow to all other players
  players.forEach((p) => {
    if (player.name !== p.name) {
      io.to(p.socketId).emit('arrayOfPlayer', shadow);
    }
  });
};

const gameDifficulty = (difficulty: string): number => {
  switch (difficulty) {
    case 'veteran':
      return VETERAN;
    case 'hardcore':
      return HARDCORE;
    case 'insane':
      return INSANE;
    default:
      return RECRUIT;
  }
};

export { updatePlayers, handlePlayerKeyDown, gameDifficulty };
