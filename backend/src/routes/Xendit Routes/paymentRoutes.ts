import express from 'express';
import { buyItem } from '../../controllers/transaction_controllers/shopController';
import { handlePaymentCallback } from '../../controllers/transaction_controllers/webhookController'; // Correct import path

const router = express.Router();

router.post('/buy-item', buyItem);
router.post('/payment', handlePaymentCallback);

export default router;