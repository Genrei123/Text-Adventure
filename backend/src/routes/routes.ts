import { login, register } from '../controllers/authController';
import express from 'express';
import User from '../model/user';

const router = express.Router();

router.post('/api/login', login);
router.post('/api/register', register);
router.get('/confirm-email/:code', async (req, res) => {
  const { code } = req.params;
  const user = await User.findOne({ where: { verificationCode: code } });

  if (!user) {
    return res.status(400).send("Invalid or expired verification code.");
  }

  user.verificationCode = undefined;
  user.verificationExpiry = undefined;
  user.emailVerified = true;
  await user.save();

  res.redirect('/email-confirmed');
});

export default router;