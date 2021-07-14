import mongoose from 'mongoose';
import { IUser } from '../interfaces/';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'This email is already in use'],
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  playedGames: {
    type: Number,
    default: 0,
  },
  bestScore: {
    type: Number,
    default: 0,
  },
  bestLevel: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'pending',
  },
  token: {
    type: String,
  },
});

export default mongoose.model<IUser>('User', userSchema);
