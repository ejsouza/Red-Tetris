import { APIurl } from '../utils/const';

interface IRoom {
  id: string;
  name: string;
  open: boolean;
  close: boolean;
  numberPeopleInRoom: number;
  players: Array<string>;
}

export const getRooms = async (): Promise<IRoom[]> => {
  const res = await fetch(`${APIurl}/rooms`, {
    method: 'GET', // *GET(get is optional), POST, PUT, DELETE, etc
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

export const getRoomByName = async (roomName: string): Promise<IRoom> => {
  const res = await fetch(`${APIurl}/rooms/${roomName}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

export const createGame: (roomName: string, userName: string) => void = (
  roomName: string,
  userName: string
) => {
  fetch(`${APIurl}/rooms`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: roomName,
      players: userName,
      open: true,
      numberPeopleInRoom: 1,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};
