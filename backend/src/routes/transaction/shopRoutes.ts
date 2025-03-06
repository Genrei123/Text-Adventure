import express, { Request, Response } from 'express';
// import { createCustomer } from '../../service/transaction/Subscription/customerService';
// import { createPaymentMethod } from '../../service/transaction/Subscription/paymentMethodService';
// import { createSubscriptionPlan } from '../../service/transaction/Subscription/subscriptionService';
import { buyItem, getCoins, deductCoins, getAllItems } from '../../controllers/transaction/shopController';
import { handlePaymentCallback } from '../../controllers/transaction/shopWebhookController'; // Correct import path
import { createSubscription } from '../../controllers/transaction/subscriptionController'; // Correct import path

const router = express.Router();

// Route for buying an item on shop
router.post('/buy-item', buyItem);
router.post('/payment', handlePaymentCallback);
router.post('/subscribe', createSubscription);

// Route for fetching all items
router.get('/items', getAllItems);
router.get('/coins', getCoins);
router.post('/deduct-coins', deductCoins);



export default router;