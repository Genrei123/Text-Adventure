import { Request, Response } from 'express';
import { PaymentRequest } from '../service/xenditClient';
import { PaymentRequestParameters, PaymentRequestCurrency } from 'xendit-node/payment_request/models';

// Placeholder functions, replace with actual implementations
const getItemDetails = async (itemId: string) => {
  return { id: itemId, price: 100 }; // Example item details
};

const getUserDetails = async (userId: string) => {
  return { id: userId, phone: '1234567890' }; // Example user details
};

export const buyItem = async (req: Request, res: Response) => {
  const { itemId, userId, paymentMethod } = req.body;

  // Fetch item details and user details from your database
  const item = await getItemDetails(itemId);
  const user = await getUserDetails(userId);

  // Create a payment request
  const data: PaymentRequestParameters = {
    amount: item.price,
    paymentMethod: {
      ewallet: {
        channelProperties: {
          successReturnUrl: 'https://example.com/payment-success',
          failureReturnUrl: 'https://example.com/payment-failure', // Add failureReturnUrl
        },
        channelCode: paymentMethod, // 'GCASH' or 'MAYA'
      },
      reusability: 'ONE_TIME_USE',
      type: 'EWALLET',
    },
    currency: 'PHP' as PaymentRequestCurrency, // Change to 'PHP' for GCASH
    referenceId: `order-${itemId}-${userId}`,
  };

  try {
    console.log('Creating payment request with data:', data);
    const paymentRequest = await PaymentRequest.createPaymentRequest({ data });
    console.log('Payment request created successfully:', paymentRequest);
    res.json(paymentRequest);
  } catch (error: any) {
    console.error('Error creating payment request:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('Error request data:', error.request);
      res.status(500).json({ error: 'No response received from Xendit API' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};