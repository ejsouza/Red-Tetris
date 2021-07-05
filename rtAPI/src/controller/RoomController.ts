import Room from '../model/Room';
import Player from '../model/Player';
import _Room, { I_Room } from '../model/_Room';
import _Player from '../model/_Player';
import * as socketIO from 'socket.io';
import { IShadow } from '../interfaces/';
import { SHADOWS } from '../utils/const';


interface IRoom {
  name: string;
  players: Player[];
  open: boolean;
  numberOfPlayers: number;
  host: string;
}

const createRoom = (roomName: string, playerName: string, id: string): Room => {
  const room: IRoom = {
    name: roomName,
    open: true,
    numberOfPlayers: 1,
    host: playerName,
    players: [new Player(playerName, id, true)],
  };
  return new Room(room);
};


const _createRoom = (
  roomName: string,
  playerName: string,
  id: string
): _Room => {
  const room: I_Room = {
    name: roomName,
    isOpen: true,
    numberOfPlayers: 1,
    gameHost: playerName,
    players: [
      new _Player({
        name: playerName,
        id,
        isHost: true,
        roomName,
      }),
    ],
  };
  return new _Room(room);
};

const _addPlayerToRoom = (
  room: _Room,
  name: string,
  socketId: string
): void => {
  const player = {
    name,
    id: socketId,
    isHost: false,
    roomName: room.name,
  };
  room.addPlayer(player);
};

const addPlayerToRoom = (room: Room, name: string, socketId: string): void => {
  const player = {
    name,
    socketId,
  };
  room.addPlayer(player);
};

const emitSuccesfullyCreated = (
  socket: socketIO.Socket,
  host: boolean
): void => {
  socket.emit('room', {
    success: true,
    msg: `Please wait joining loby`,
    host,
  });
};

const emitRoomIsFull = (socket: socketIO.Socket, roomName: string): void => {
  socket.emit('room', {
    success: false,
    msg: `This room '${roomName}' is full`,
  });
};

const emitUserNametaken = (socket: socketIO.Socket, userName: string): void => {
  socket.emit('room', {
    success: false,
    msg: `This username '${userName}' is already taken`,
  });
};

const emitInfoShadows = (io: socketIO.Server, players: Player[]): void => {
  players.forEach((player) => {
    // Send first nextPiece to every player
    io.to(player.socketId).emit('gameInfo', player.showNextPiece);
    // ************************************
    // Send enimies board shadow
    const shadows: IShadow[] = [];
    players.forEach((p) => {
      if (player.name !== p.name) {
        let shadow: IShadow = {
          player: p.name,
          board: p.board.shape,
        };
        shadows.push(shadow);
      }
    });
    io.sockets.to(player.socketId).emit(SHADOWS, shadows);
  });
};

export {
  createRoom,
  addPlayerToRoom,
  _createRoom,
  _addPlayerToRoom,
  emitSuccesfullyCreated,
  emitRoomIsFull,
  emitUserNametaken,
  emitInfoShadows,
};
