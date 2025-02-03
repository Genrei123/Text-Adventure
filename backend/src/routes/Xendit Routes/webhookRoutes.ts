import express from 'express';
import { handlePaymentCallback } from '../../controllers/transaction_controllers/shopWebhookController'; // Import the handlePaymentCallback function

const router = express.Router();

router.post('/webhook', async (req, res) => {
  const event = req.body;

  console.log('Received webhook event:', event);

  try {
    switch (event.type) {
      case 'recurring.plan.activated':
        // Handle plan activation
        console.log('Plan activated:', event.data);
        // Update your database to mark the plan as activated
        break;
      case 'recurring.cycle.succeeded':
        // Handle successful payment cycle
        console.log('Payment cycle succeeded:', event.data);
        // Update your database to mark the payment as successful
        break;
      case 'recurring.cycle.retrying':
        // Handle payment retry
        console.log('Payment cycle retrying:', event.data);
        // Update your database to mark the payment as retrying
        break;
      case 'recurring.cycle.failed':
        // Handle failed payment cycle
        console.log('Payment cycle failed:', event.data);
        // Update your database to mark the payment as failed and terminate the service if necessary
        break;
      case 'payment_request.paid':
        // Handle payment success for buyItem
        console.log('Payment request paid:', event.data);
        await handlePaymentCallback(req, res);
        return; // Return to avoid sending another response
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.status(200).send('Event received');
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;