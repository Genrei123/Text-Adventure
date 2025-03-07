import { Router } from 'express';
import { generateImage, getGameImage } from '../../controllers/img-generation/openaiController';

const router = Router();

router.post('/generate-image', generateImage);
router.get('/game-image/:gameId', getGameImage);
// Must put requestHandler on generateImage if still doesn't work later on.

export default router;