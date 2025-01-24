import { Router } from 'express';
import { createSubscriptionPlan, updateSubscriptionPlan, stopSubscriptionPlan, handleSubscriptionWebhook } from '../controllers/transaction_controllers/subscriptionController';

const router = Router();

router.post('/create-subscription', createSubscriptionPlan);
router.patch('/update-subscription/:id', updateSubscriptionPlan);
router.post('/stop-subscription/:id', stopSubscriptionPlan);
router.post('/webhook', handleSubscriptionWebhook);

export default router;