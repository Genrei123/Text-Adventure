import { Router } from 'express';
import { login, register, verifyEmail } from '../controllers/authController';
import { processUserResponse } from '../controllers/chatController';

const router = Router();

router.post('/api/login', login);
router.post('/api/register', register);
router.post('/api/verify-email', verifyEmail);
router.post('/api/chat', processUserResponse);

export default router;