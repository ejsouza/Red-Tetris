import { Router } from 'express';
import { getRooms } from '../controllers/rooms';
import { baseURL } from '../config/const'

const router: Router = Router();

router.get(`${baseURL}/rooms`, getRooms);

export default router;