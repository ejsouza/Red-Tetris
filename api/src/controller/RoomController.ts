import Room, { IRoom } from '../model/Room';
import Player from '../model/Player';
import * as socketIO from 'socket.io';

const createRoom = (roomName: string, playerName: string, id: string): Room => {
  const room: IRoom = {
    name: roomName,
    isOpen: true,
    numberOfPlayers: 1,
    gameHost: playerName,
    players: [
      new Player({
        name: playerName,
        id,
        isHost: true,
        roomName,
      }),
    ],
  };
  return new Room(room);
};

const addPlayerToRoom = (room: Room, name: string, socketId: string): void => {
  const player = new Player({
    name,
    id: socketId,
    isHost: false,
    roomName: room.name,
  });
  room.addPlayer(player);
  if (room.game) {
    room.game.addPlayer(player);
  }
};

const emitSuccesfullyCreated = (
  socket: socketIO.Socket,
  host: boolean,
  join: boolean
): void => {
  const isJoin = join ? 'join-' : '';
  socket.emit(`${isJoin}room`, {
    success: true,
    msg: `Please wait joining loby`,
    host,
  });
};

const emitRoomIsFull = (
  socket: socketIO.Socket,
  roomName: string,
  join: boolean
): void => {
  const isJoin = join ? 'join-' : '';
  socket.emit(`${isJoin}room`, {
    success: false,
    msg: `This room '${roomName}' is full`,
  });
};

const emitUserNametaken = (
  socket: socketIO.Socket,
  userName: string,
  join: boolean
): void => {
  const isJoin = join ? 'join-' : '';
  socket.emit(`${isJoin}room`, {
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
