import express from 'express';
import { getCoinsByEmail, deductCoins } from '../../controllers/transaction/shopController';

const router = express.Router();

router.get('/coins/:email', getCoinsByEmail);
router.post('/deduct-coins', deductCoins);

export default router;