export interface IGame {
  name: string;
  open: boolean;
  over: boolean;
  numberOfPlayers: number;
  players: string[];
  createdAt: Date;
}
