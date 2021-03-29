import { Response, Request, NextFunction } from 'express';
import { IBaseRoom } from '../../rooms/room.interface';
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

const createRoom = (req: Request, res: Response, next: NextFunction) => {
  const room: IBaseRoom = req.body;
  const request: Request = req;
  const newRoom = new Room(room);

  try {
    const response = newRoom.save();
    res.status(201).json({ success: true, room: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const deleteRoom = (req: Request, res: Response) => {
  const name = req.params.name;
  console.log(`name to delete >>> ${name}`);
  try {
    const response = Room.findOne({ name: name });
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    console.log(`Error Deleating >>> ${error}`);
    res.status(500).json({ success: false, error: error });
  }
};
export { getRooms, getRoomsByName, createRoom, deleteRoom };