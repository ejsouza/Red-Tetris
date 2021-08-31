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

interface IShadow {
  player: string;
  board: number[][];
}

export { IRoom, IShadow };
