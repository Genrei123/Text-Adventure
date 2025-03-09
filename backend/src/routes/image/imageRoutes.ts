// routes/image/index.ts
import express from 'express';
import { upload as multerMiddleware } from '../../service/image/imageService';
import { upload as uploadController } from '../../controllers/image/imageController';
//import { authenticate } from '../../middleware/auth'; // Adjust path to your auth middleware

const router = express.Router();

// Apply authentication middleware and multer middleware before the controller
router.post('/upload', multerMiddleware, uploadController);

export default router;