import { Router } from 'express';
import { login, logout, register, verifyEmail, verifyTokenParam } from '../../controllers/auth/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/admin/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-token', verifyTokenParam);
router.post("/logout", logout);

export default router;