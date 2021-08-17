import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  playedGames: number;
  bestScore: number;
  bestLevel: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  token: string;
  defeat: number;
  victory: number;
}
