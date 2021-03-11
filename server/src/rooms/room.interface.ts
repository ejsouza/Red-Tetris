// src/rooms/room.interface.ts

import { Document } from 'mongoose';

export interface IBaseRoom extends Document {
	name: string;
	open: boolean;
	close: boolean;
	numberPeopleInRoom: number;
}

export interface IRoom extends IBaseRoom {
	id: number;
}