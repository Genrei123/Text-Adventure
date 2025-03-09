import express, { Router } from 'express';
import { getBans, createBan, removeBan } from '../../controllers/admin/banController';

const router: Router = express.Router();

// Ban routes
router.get('/bans', getBans);
router.post('/bans', createBan);
router.delete('/bans/:userId', removeBan);

export default router; 