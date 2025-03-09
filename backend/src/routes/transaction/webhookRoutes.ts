import express from 'express';
import { handlePaymentWebhook } from '../../controllers/transaction/shopController'; // Import the correct function

const router = express.Router();

router.post('/webhook', async (req, res) => {
  const event = req.body;

  console.log('Received webhook event:', event);

  try {
    switch (event.type) {
      case 'payment_request.paid':
        // Handle payment success for buyItem or buyTokenPackage
        console.log('Payment request paid:', event.data);
        await handlePaymentWebhook(req, res); // Call handlePaymentWebhook here
        return; // Return to avoid sending another response
      case 'recurring.plan.activated':
        // Handle plan activation
        console.log('Plan activated:', event.data);
        break;
      case 'recurring.cycle.succeeded':
        // Handle successful payment cycle
        console.log('Payment cycle succeeded:', event.data);
        break;
      case 'recurring.cycle.retrying':
        // Handle payment retry
        console.log('Payment cycle retrying:', event.data);
        break;
      case 'recurring.cycle.failed':
        // Handle failed payment cycle
        console.log('Payment cycle failed:', event.data);
        break;
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