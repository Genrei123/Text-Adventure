import express from 'express';
import { createCustomer } from '../service/customerService';
import { createPaymentMethod } from '../service/paymentMethodService';
import { createSubscriptionPlan } from '../service/subscriptionService';

const router = express.Router();

// Route for creating a customer
router.post('/create-customer', async (req, res) => {
  try {
    const customerData = req.body.customerData;
    const customer = await createCustomer(customerData);
    console.log('Customer created:', customer);
    res.status(201).json(customer);
  } catch (error: any) {
    console.error('Error creating customer:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Route for creating a payment method
router.post('/create-payment-method', async (req, res) => {
  try {
    const paymentMethodData = req.body.paymentMethodData;
    const paymentMethod = await createPaymentMethod(paymentMethodData);
    console.log('Payment method created:', paymentMethod);
    res.status(201).json(paymentMethod);

    // If the payment method requires action, provide the URL to the user
    if (paymentMethod.status === 'REQUIRES_ACTION') {
      res.status(201).json({
        message: 'Payment method requires action',
        action_url: paymentMethod.actions[0].url
      });
    } else {
      res.status(201).json(paymentMethod);
    }
  } catch (error: any) {
    console.error('Error creating payment method:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Route for creating a subscription plan
router.post('/create-subscription-plan', async (req, res) => {
  try {
    const planData = req.body.planData;
    const plan = await createSubscriptionPlan(planData);
    console.log('Subscription plan created:', plan);
    res.status(201).json(plan);
  } catch (error: any) {
    console.error('Error creating subscription plan:', error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;