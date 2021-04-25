import { Response, Request, NextFunction } from 'express';
import { IBaseRoom } from '../../rooms/room.interface';
import Room from '../../models/Room';

const getRooms = async (req: Request, res: Response): Promise<void> => {
		await Room.find(function (err, rooms) {
      if (err) {
        console.log(`Error retrieving rooms -: ${err}`);
        res.status(500).json({ success: false, msg: `Failed to get rooms` });
      } else {
        res.status(200).json({ success: true, count: rooms.length, rooms });
      }
    });
}

const getRoomByName = async (req: Request, res: Response): Promise<void> => {
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

const deleteRoomByName = async (req: Request, res: Response) => {
  const name = req.params.name;
  Room.findOneAndDelete({ name: name })
    .exec()
    .then((response) => {
      if (response === null) {
        return res
          .status(400)
          .json({
            success: false,
            message: `room with name '${name}' doesn't exist`,
          });
      }
      console.log('response from removing =: ', response);
      res.status(201).json({ success: true, room: response });
    })
    .catch((err) => {
      console.log('something when wrong while deleting room ', err);
      res
        .status(500)
        .json({
          success: false,
          message: 'something went wrong while deleting room',
        });
    });
};

const deleteById = async (req: Request, res: Response) => {
  const id = req.params.id

  console.log(`it doesn't get here ? ${id}`);
  Room.findByIdAndDelete(id)
    .exec()
    .then(resp => {
      res.status(200).json({ success: true, message: `remove by id ${id}`, resp });
    })
    .catch(err => {
      res.status(500).json({success: false, message: `error on deleting room with id ${id}`});
    })
  
}
export { getRooms, getRoomByName, createRoom, deleteRoomByName, deleteById };