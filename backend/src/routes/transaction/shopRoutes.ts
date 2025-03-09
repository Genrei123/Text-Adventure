import express, { Request, Response } from 'express';
// import { createCustomer } from '../../service/transaction/Subscription/customerService';
// import { createPaymentMethod } from '../../service/transaction/Subscription/paymentMethodService';
// import { createSubscriptionPlan } from '../../service/transaction/Subscription/subscriptionService';
import { 
  buyItem, 
  getCoins, 
  deductCoins, 
  getAllItems,
  buyTokenPackage,
  getAllTokenPackages,
  handlePaymentWebhook,
  getUserOrderHistory
} from '../../controllers/transaction/shopController';
import { handlePaymentCallback } from '../../controllers/transaction/shopWebhookController'; // Correct import path
import { createSubscription, getSubscriptionOffers, getUserSubscriptions } from '../../controllers/transaction/subscriptionController';

const router = express.Router();

// Route for buying an item on shop
router.post('/buy-item', buyItem);
router.post('/payment', handlePaymentCallback);
router.post('/subscribe', createSubscription);

// Route for fetching all items
router.get('/items', getAllItems);
router.get('/coins', getCoins);
router.post('/deduct-coins', deductCoins);

// Token package routes
router.get('/tokens/packages', getAllTokenPackages);
router.post('/tokens/purchase', buyTokenPackage);
router.post('/tokens/webhook', handlePaymentWebhook);

// Coins management
router.get('/coins', getCoins);
router.post('/coins/deduct', deductCoins);

// Order history
router.get('/orders', getUserOrderHistory);

// Route for fetching subscription offers
router.get('/subscription/offers', getSubscriptionOffers);
router.get('/subscription/user/:email', getUserSubscriptions);

export default router;