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
        },
        channelCode: paymentMethod, // 'GCASH' or 'MAYA'
      },
      reusability: 'ONE_TIME_USE',
      type: 'EWALLET',
    },
    currency: 'IDR' as PaymentRequestCurrency,
    referenceId: `order-${itemId}-${userId}`,
  };

  try {
    const paymentRequest = await PaymentRequest.createPaymentRequest({ data });
    res.json(paymentRequest);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};