import { Document, Model, model, Types, Schema, Query } from 'mongoose';
import { IBaseRoom } from '../rooms/room.interface';

const RoomScheme = new Schema ({
	name: {
		type: String,
		required: true,
		unique: [true, "Room name already in use"],
		trim: true,
		maxlength: [10, "Room name can not be more than 10 characters"]
	},
	players: [String],
	numberOfPlayers: Number,
	open: Boolean,
	createdAt: {
		type: Date,
		default: Date.now
	},

});
const Room = model('Room', RoomScheme);
export default Room;