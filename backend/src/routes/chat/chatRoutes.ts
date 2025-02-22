import { Router } from 'express';
import { handleChatRequestController, getChatHistoryController } from '../../controllers/chat/chatController';

const router = Router();

router.post('/chat', handleChatRequestController);
router.post('/get-chat', getChatHistoryController);

export default router;