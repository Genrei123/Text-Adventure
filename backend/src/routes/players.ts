import { Router } from 'express';
import { getPlayers } from '../controllers/players.controller';

const router = Router();

router.get('/', getPlayers);

export default router;