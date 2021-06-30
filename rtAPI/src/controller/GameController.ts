import * as socketIO from 'socket.io';
import Player from '../model/Player';

const updatePlayers = (
  io: socketIO.Server,
  socket: socketIO.Socket,
  players: Player[],
  gameName: string
): void => {
  players.forEach((player) => {
    if (player.pieceCanFall()) {
      player.cleanPieceFromBoard();
      player.pieceIncrementY();
      player.draw();
    } else {
      if (player.isGameOver()) {
        // stop game here
      } else {
        // // sending to all clients in 'game' room(channel) except sender
        socket.broadcast.to(gameName).emit('pushNextPiece');
      }
      io.to(player.socketId).emit('youLost');
      // check for game over
      // *******************
      // if not game over update pieces
      // *******************
    }
    io.to(player.socketId).emit('updateBoard', player.board.shape);
  });
};

export { updatePlayers };
