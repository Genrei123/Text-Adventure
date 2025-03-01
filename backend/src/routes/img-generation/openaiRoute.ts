import { Router } from 'express';
import { generateImage } from '../../controllers/img-generation/openaiController';

const router = Router();

router.post('/generate-image', generateImage);
// Must put requestHandler on generateImage if still doesn't work later on.

export default router;