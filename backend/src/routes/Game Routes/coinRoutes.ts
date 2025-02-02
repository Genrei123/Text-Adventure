import express from 'express';
import { getCoins, deductCoins } from '../../controllers/transaction_controllers/shopController';

const router = express.Router();

router.get('/coins/:userId', getCoins);
router.post('/deduct-coins', deductCoins);

export default router;