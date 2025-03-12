import { Router } from 'express';
import { getPlayers } from '../../controllers/admin/playersController';

const router = Router();

router.get('/', getPlayers);

export default router;