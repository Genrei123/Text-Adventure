import { Router } from 'express';
import { getMetrics, getGamesCount } from '../controllers/metrics.controller';

const router = Router();

router.get('/', getMetrics);
router.get('/games', getGamesCount);

export default router;