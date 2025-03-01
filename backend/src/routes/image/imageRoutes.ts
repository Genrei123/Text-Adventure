import express from 'express';
import { upload as multerUpload } from '../../service/image/imageService'; // Import Multer
import { upload } from '../../controllers/image/imageController';

const router = express.Router();

router.post('/upload', multerUpload, upload);

export default router;