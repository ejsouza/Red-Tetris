import { Router } from 'express';
import {
  getRooms,
  getRoomsByName,
  createRoom,
} from '../controllers/rooms/rooms';

const router: Router = Router();

router.get(`/rooms`, getRooms);

router.get(`/rooms/:name`, getRoomsByName);

router.post(`/rooms`, createRoom);

export default router;