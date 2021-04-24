import { Router } from 'express';
import {
  getRooms,
  getRoomByName,
  createRoom,
  deleteRoomByName,
  deleteById,
} from '../controllers/rooms/rooms';

import { get, create, close, remove } from '../controllers/games';

const router: Router = Router();

/**
 * Room
 */
router.get(`/rooms`, getRooms);

router.get(`/rooms/:name`, getRoomByName);

router.post(`/rooms`, createRoom);

router.delete(`/rooms/:name`, deleteRoomByName);

// router.delete(`/rooms/:id`, deleteById);

/**
 * Game
 */

router.get('/games', get);

router.post('/games', create);

router.put('/games', close);

router.delete('/games', remove);

export default router;