import { Router } from 'express';
import { login, register, verifyEmail } from '../../controllers/auth/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-email', verifyEmail);

export default router;