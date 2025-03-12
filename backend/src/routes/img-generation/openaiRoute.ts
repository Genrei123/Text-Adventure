import { Router } from 'express';
import { generateBannerImage, generateChatImage, getGameImage, generateGameSummary} from '../../controllers/img-generation/openaiController';


const router = Router();

router.post('/generate-image', generateImage); // Use the new generateImage function
router.post('/generate-chat-image', generateChatImage); // Optionally keep this for legacy or specific use
router.get('/game-image/:gameId', getGameImage);
router.post('/generateBannerImage', generateBannerImage);
router.post('/generateGameSummary', generateGameSummary);
// Must put requestHandler on generateImage if still doesn't work later on.


export default router;