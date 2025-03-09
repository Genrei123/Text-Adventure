import { Router } from 'express';
import { generateImage } from '../../controllers/img-generation/comfyuiController';

const router = Router();

// ComfyUI image generation endpoint
router.post('/generate', generateImage);

export default router;