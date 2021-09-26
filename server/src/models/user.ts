import mongoose from 'mongoose';
import { IUser } from '../interfaces/';

const userSchema = new mongoose.Schema(
  {
   
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
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    playedGames: {
      type: Number,
      default: 0,
    },
    victory: {
      type: Number,
      default: 0,
    },
    defeat: {
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
    status: {
      type: String,
      default: 'pending',
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

// userSchema.loadClass(User)
export default mongoose.model<IUser>('User', userSchema);
