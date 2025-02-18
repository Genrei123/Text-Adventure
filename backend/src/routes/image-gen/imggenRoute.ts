import { Router, RequestHandler } from 'express';
import { generateImage } from '../../controllers/image-gen/imggenController';

const router = Router();

router.post('/image-gen', generateImage);


export default router;