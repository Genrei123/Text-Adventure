import { Router } from 'express';
import { createSubscriptionPlan, updateSubscriptionPlan, stopSubscriptionPlan, handleSubscriptionWebhook } from '../controllers/transaction_controllers/subscriptionController';
import { createCustomerController } from '../controllers/transaction_controllers/customerController';
import { createPaymentMethodController } from '../controllers/transaction_controllers/paymentMethodController';

const router = Router();

router.post('/create-customer', createCustomerController);
router.post('/create-payment-method', createPaymentMethodController);
router.post('/create-subscription', createSubscriptionPlan);
router.put('/update/:id', updateSubscriptionPlan);
router.delete('/stop/:id', stopSubscriptionPlan);
router.post('/webhook', handleSubscriptionWebhook);

export default router;