import Room from '../model/Room';
import Player from '../model/Player';
import * as socketIO from 'socket.io';

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

const addPlayerToRoom = (room: Room, name: string, socketId: string): void => {
  const player = {
    name,
    socketId,
  };
  room.addPlayer(player);
};

const emitSuccesfullyCreated = (socket: socketIO.Socket): void => {
  socket.emit('room', {
    success: true,
    msg: `Please wait joining loby`,
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

export {
  createRoom,
  addPlayerToRoom,
  emitSuccesfullyCreated,
  emitRoomIsFull,
  emitUserNametaken,
};
