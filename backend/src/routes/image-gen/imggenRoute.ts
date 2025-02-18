import { Router } from 'express';
import { generateImage } from '../../controllers/image-gen/imggenController';

const router = Router();

router.post('/generate-image', generateImage);

export default router;