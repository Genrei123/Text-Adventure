import { Router } from 'express';
import { handleChatRequestController, getChatHistoryController, storeImage } from '../../controllers/chat/chatController';

const router = Router();

router.post('/chat', handleChatRequestController);
router.post('/get-chat', getChatHistoryController);
router.post('/store-image', storeImage);

export default router;