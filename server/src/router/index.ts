import { Router } from 'express';
import { getRooms, createRoom } from '../controllers/rooms/rooms';

const router: Router = Router();

router.get(`/rooms`, getRooms);

router.post(`/rooms`, createRoom);

export default router;