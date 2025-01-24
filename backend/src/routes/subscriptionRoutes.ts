import { Router } from 'express';
import { createSubscriptionPlan, updateSubscriptionPlan, stopSubscriptionPlan, handleSubscriptionWebhook } from '../controllers/transaction_controllers/subscriptionController';

const router = Router();

// Route to create a subscription plan
router.post('/subscriptions', createSubscriptionPlan);

// Route to update a subscription plan
router.patch('/subscriptions/:id', updateSubscriptionPlan);

// Route to stop a subscription plan
router.post('/subscriptions/:id/stop', stopSubscriptionPlan);

// Route to handle subscription webhooks
router.post('/subscriptions/webhook', handleSubscriptionWebhook);

export default router;