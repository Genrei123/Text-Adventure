import { Router } from 'express';
import { processUserResponse } from '../controllers/chatController';

const router = Router();

router.post('/chat', processUserResponse);

export default router;