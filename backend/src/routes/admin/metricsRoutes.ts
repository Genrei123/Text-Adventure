import { Router } from 'express';
import { getMetrics, getGamesCount } from '../../controllers/admin/metricsController';

const router = Router();

router.get('/', getMetrics);
router.get('/games', getGamesCount);

export default router;