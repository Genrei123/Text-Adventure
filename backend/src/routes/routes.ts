import { Router } from 'express';
import { login, register, verifyEmail } from '../controllers/authController';

const router = Router();

router.post('/api/login', login);
router.post('/api/register', register);
router.post('/api/verify-email', verifyEmail);

export default router;