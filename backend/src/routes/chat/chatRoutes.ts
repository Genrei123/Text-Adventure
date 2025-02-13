import { Router } from 'express';
import { processUserResponse } from '../../controllers/chat/chatController';

const router = Router();

router.post('/', processUserResponse);

export default router;