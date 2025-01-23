import { Request, Response } from 'express';
import { PaymentRequest } from '../../service/xenditClient';
import { PaymentRequestParameters, PaymentRequestCurrency } from 'xendit-node/payment_request/models';
import User from '../../model/user'; // Import the User model
import dotenv from 'dotenv';

dotenv.config();

// Simulated database of items
const items = [
  { id: 'item1', name: '500 Coins Package', price: 100, coins: 500 },
  { id: 'item2', name: '1500 Coins Package', price: 200, coins: 1500 },
  { id: 'item3', name: '3000 Coins Package', price: 300, coins: 3000 },
  { id: 'item4', name: '5000 Coins Package', price: 300, coins: 4500 },
];

// Function to fetch item details based on item ID
const getItemDetails = async (itemId: string) => {
  const item = items.find(item => item.id === itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
};

// Function to fetch user details from the database using email
const getUserDetailsByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const buyItem = async (req: Request, res: Response) => {
  const { itemId, paymentMethod, email } = req.body;

  let item;
  let user;
  let orderId;

  try {
    // Fetch item details and user details from your database
    item = await getItemDetails(itemId);
    user = await getUserDetailsByEmail(email);

    // Create an orderId with username and date
    const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Format date as YYYYMMDD
    orderId = `order-${itemId}-${item.name}-${user.username}-${date}`;

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
      referenceId: orderId, // This is the field used by Xendit for tracking
    };

    const paymentRequest = await PaymentRequest.createPaymentRequest({ data });
    const paymentLink = paymentRequest.actions?.find((action: { urlType: string }) => action.urlType === 'WEB')?.url || 'N/A';
    const formattedDate = new Date().toLocaleString();

    console.log(`Status: Success
Item ID: ${itemId}
Item Name: ${item.name}
User ID: ${user.id}
Username: ${user.username}
User Email: ${user.email}
Payment Method: ${paymentMethod}
Amount: ${item.price}
Date Created: ${formattedDate}
Order ID: ${orderId}
Payment Request ID: ${paymentRequest.id}
Link To Payment: ${paymentLink}`);
    res.json({ paymentLink });
  } catch (error: any) {
    const formattedDate = new Date().toLocaleString();
    console.error(`Status: Fail
Item ID: ${itemId}
Item Name: ${item?.name || 'N/A'}
User ID: ${user?.id || 'N/A'}
Username: ${user?.username || 'N/A'}
User Email: ${email}
Payment Method: ${paymentMethod}
Amount: ${item?.price || 'N/A'}
Date Created: ${formattedDate}
Order ID: ${orderId}
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

export const handlePaymentCallback = async (req: Request, res: Response): Promise<void> => {
  const { data, event } = req.body;
  const { id: external_id, status, reference_id } = data;
  const webhookToken = req.headers['x-callback-token'];

  // Verify the webhook token
  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    console.error('Invalid webhook token');
    res.status(401).json({ message: 'Invalid webhook token' });
    return;
  }

  console.log(`Received payment callback for order: ${reference_id} with status: ${status}`);

  if (event === 'payment_method.activated') {
    console.log(`Payment method activated for order: ${reference_id}`);
    res.status(200).json({ message: 'Payment method activated' });
  } else if (event === 'payment_method.expired') {
    console.log(`Payment method expired for order: ${reference_id}`);
    res.status(200).json({ message: 'Payment method expired' });
  } else if (status === 'SUCCEEDED' || status === 'COMPLETED' || status === 'PAID') {
    try {
      // Check if reference_id format is as expected
      const referenceIdParts = reference_id.split('-');
      if (referenceIdParts.length !== 5) {
        console.error(`Invalid reference_id format: ${reference_id}`);
        res.status(400).json({ message: `Invalid reference_id format: ${reference_id}` });
        return;
      }

      // Extract itemId and email from reference_id
      const [orderPrefix, itemId, itemName, username, date] = referenceIdParts;
      console.log(`Extracted values - itemId: ${itemId}, itemName: ${itemName}, username: ${username}, date: ${date}, external_id: ${external_id}`);
      console.log(`Processing payment for order: ${reference_id}`);

      const user = await User.findOne({ where: { username } });

      if (!user) {
        console.log(`User not found for order: ${reference_id}`);
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const item = await getItemDetails(itemId);

      // Update user's coins
      user.coins = (user.coins || 0) + item.coins;
      await user.save();

      console.log(`Payment completed for order: ${reference_id}. Coins added: ${item.coins}. Total coins: ${user.coins}. External ID: ${external_id}`);
      res.status(200).json({ message: 'Payment confirmed and coins added to user account' });
    } catch (error: any) {
      console.error('Error handling payment callback:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (status === 'REQUIRES_ACTION') {
    console.log(`Payment requires action for order ${reference_id}. Actions: ${JSON.stringify(data.actions, null, 2)}`);
    res.status(200).json({ message: 'Payment requires action', actions: data.actions });
  } else {
    console.log(`Payment status for order ${reference_id}: ${status}`);
    res.status(200).json({ message: `Payment status: ${status}` });
  }
};