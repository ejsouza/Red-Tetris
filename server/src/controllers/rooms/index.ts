import { Response, Request } from 'express';
import { IBaseRoom } from '../../rooms/room.interface';
import Room from '../../models/model';

const getRooms = async (req: Request, res: Response): Promise<void> => {
	try {
		const rooms : IBaseRoom[] = await Room.find();
		res.status(200).json({ rooms });
	} catch (error) {
		throw error;
	}
}

export { getRooms };