import { Request, Response } from 'express';
import { PaymentRequest } from '../service/xenditClient';
import { PaymentRequestParameters, PaymentRequestCurrency } from 'xendit-node/payment_request/models';

// Placeholder functions, replace with actual implementations
const getItemDetails = async (itemId: string) => {
  return { id: itemId, name: 'Sample Item', price: 100 }; // Example item details
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
          failureReturnUrl: 'https://example.com/payment-failure',
        },
        channelCode: paymentMethod, // 'GCASH' or 'MAYA'
      },
      reusability: 'ONE_TIME_USE',
      type: 'EWALLET',
    },
    currency: 'PHP' as PaymentRequestCurrency,
    referenceId: `order-${itemId}-${userId}`,
  };

  try {
    const paymentRequest = await PaymentRequest.createPaymentRequest({ data });
    const paymentLink = paymentRequest.actions?.find((action: { urlType: string }) => action.urlType === 'WEB')?.url || 'N/A';
    console.log(`Request Status: Success
Item ID: ${itemId}
User ID: ${userId}
Payment Method: ${paymentMethod}
Date Created: ${new Date().toISOString()}
Link To Payment: ${paymentLink}`);
    res.json(paymentRequest);
  } catch (error: any) {
    console.error(`Request Status: Fail
Item ID: ${itemId}
User ID: ${userId}
Payment Method: ${paymentMethod}
Date Created: ${new Date().toISOString()}
Error: ${error.message}`);
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: 'No response received from Xendit API' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};