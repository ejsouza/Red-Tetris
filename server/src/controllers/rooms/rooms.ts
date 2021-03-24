import { Response, Request, NextFunction } from 'express';
import { Model } from 'mongoose';
import { IBaseRoom } from '../../rooms/room.interface';
// import Room from '../../models/model';
import Room from '../../models/Room';

const getRooms = async (req: Request, res: Response): Promise<void> => {
		await Room.find(function (err, rooms) {
      if (err) {
        console.log(`Error retrieving rooms -: ${err}`);
        res.status(500).json({ success: false, msg: `Failed to get rooms` });
      } else {
        res.status(200).json({ success: true, rooms });
      }
    });
}

const getRoomsByName = async (req: Request, res: Response): Promise<void> => {
  console.log(`API  getRoomsByName -: ${req.params}`);
  const name = req.params.name;
  await Room.findOne({ name: name }, function (err: any, room: IBaseRoom) {
    if (err) {
      console.log(`Error retrieving rooms -: ${err}`);
      res.status(500).json({ success: false, msg: `Failed to get rooms` });
    } else {
      res.status(200).json({ success: true, room });
    }
  });
};

const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	console.log(`createRoom: ${req.body.name}`);
	const room: IBaseRoom = req.body;
	console.log(`test -: ${room.players}`);
	const request: Request = req;
	const newRoom = new Room(room);
	try {
		const room = await newRoom.save();
		res.status(200).json({success: true})

	} catch (error) {
    console.log(`Error creating room -: ${error}`);
    res.status(500).json({ success: false, msg: error });
  }
} 
export { getRooms, getRoomsByName, createRoom };