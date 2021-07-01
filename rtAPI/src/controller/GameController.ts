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
      player.cleanPieceFromBoard();
      player.pieceIncrementY();
      player.draw();
    } else {
      if (player.isGameOver()) {
        // stop game here
        io.to(player.socketId).emit('youLost');
      } else {
        // Push a new nextPiece to each user in game
        const nextPiece = newNextPiece.randomPiece();
        const applyPenalty = player.scores();
        players.forEach((p) => {
          if (applyPenalty && p.name !== player.name) {
            p.penalty();
          }
          p.updateNextPiece = nextPiece;
        });
        //*****************************************
        // Set current piece to nextPiece
        player.getNextPiece();
        // Send current player nextPiece
        io.to(player.socketId).emit('gameInfo', player.showNextPiece);
        // const shadows: IShadow[] = [];
           const shadow: IShadow = {
             player: player.name,
             board: player.board.shape,
           };
          //  shadows.push(shadow);
        players.forEach((p) => {
          if (player.name !== p.name) {
            // let shadow: IShadow = {
            //   player: p.name,
            //   board: p.board.shape,
            // };
            // shadows.push(shadow);
            io.to(p.socketId).emit('arrayOfPlayer', shadow);
          }
        });


        // sending to all clients in 'game' room(channel) except sender
        // socket.broadcast.to(gameName).emit('arrayOfPlayers', shadows);
      }
      // check for game over
      // *******************
      // if not game over update pieces
      // *******************
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
        io.to(player.socketId).emit(
          'updateBoard',
          player.board.shape,
          player.name
        );
      }
      break;
    case KEY_ARROW_RIGHT_PRESSED:
      if (player.moveRight()) {
        io.to(player.socketId).emit(
          'updateBoard',
          player.board.shape,
          player.name
        );
      }
      break;
    case KEY_ARROW_DOWN_PRESSED:
      if (player.moveDown()) {
        io.to(player.socketId).emit(
          'updateBoard',
          player.board.shape,
          player.name
        );
      }
      break;
    case KEY_ARROW_LEFT_PRESSED:
      if (player.moveLeft()) {
        io.to(player.socketId).emit(
          'updateBoard',
          player.board.shape,
          player.name
        );
      }
      break;
    case KEY_ARROW_SPACE_PRESSED:
      player.fall();
      break;
    default:
      break;
  }
};

export { updatePlayers, handlePlayerKeyDown };
