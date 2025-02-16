import express from 'express';
import { banPlayer, unbanPlayer, getBannedPlayers } from '../../controllers/admin/banController';
import { isAdmin } from '../../middleware/auth/auth';

const router = express.Router();

router.post('/ban-player', isAdmin, banPlayer);
router.post('/unban-player', isAdmin, unbanPlayer);
router.get('/banned-players', isAdmin, getBannedPlayers);

export default router;