import { Router } from 'express';
import { buyItem, handlePaymentCallback } from '../controllers/transaction_controllers/paymentController';

const router = Router();

router.post('/buy-item', buyItem);
router.post('/payment-callback', handlePaymentCallback);

export default router;