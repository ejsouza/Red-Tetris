import { Router } from 'express';
import {
  getRooms,
  getRoomsByName,
  createRoom,
  deleteRoom,
} from '../controllers/rooms/rooms';

const router: Router = Router();

router.get(`/rooms`, getRooms);

router.get(`/rooms/:name`, getRoomsByName);

router.post(`/rooms`, createRoom);

router.delete(`/rooms/:name`, deleteRoom);

export default router;