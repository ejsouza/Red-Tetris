import { IBaseRoom, IRoom } from '../rooms/room.interface';
import { model, Schema } from 'mongoose';

const roomSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
    close: {
      type: Boolean,
      required: true,
    },
    numberPeopleInRoom: {
      type: Number,
      required: true,
    },
    players: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default model<IBaseRoom>('Room', roomSchema);
