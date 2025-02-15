import { Router } from 'express';
import { handleChatRequest } from '../../controllers/chat/chatController';

const router = Router();

router.post('/chat', handleChatRequest);

export default router;