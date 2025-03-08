import { Router } from 'express';
import { handleChatRequestController, getChatHistoryController, storeBannerImage, storeImageMessage } from '../../controllers/chat/chatController';

const router = Router();

router.post('/chat', handleChatRequestController);
router.post('/get-chat', getChatHistoryController);
router.post('/store-banner-image', storeBannerImage);
router.post('/store-image', storeImageMessage);

export default router;