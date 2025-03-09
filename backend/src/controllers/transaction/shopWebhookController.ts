import { Request, Response } from 'express';
import User from '../../model/user/user';
import Order from '../../model/transaction/order';
import dotenv from 'dotenv';
import { getItemDetails } from './shopController';
import Subscriber from '../../model/transaction/SubscriberModel';
import { Op } from 'sequelize';

dotenv.config();

// Define a function to check if reference_id is for a subscription
const isSubscriptionPayment = (reference_id: string): boolean => {
  return reference_id.startsWith('subscription-') || reference_id.startsWith('sub_');
};

// Webhook handler for subscription payments
export const handleSubscriptionPaymentCallback = async (req: Request, res: Response): Promise<void> => {
  const {
    id: product_id,
    status,
    external_id: reference_id,
    payer_email: email,
    amount,
    payment_method,
    currency,
    payment_channel,
    user_id,
    description,
    paid_amount,
    created,
    updated,
    paid_at,
    merchant_name,
    payment_destination
  } = req.body;

  const webhookToken = req.headers['x-callback-token'];

  // Verify the webhook token
  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    console.error('Invalid webhook token');
    res.status(401).json({ message: 'Invalid webhook token' });
    return;
  }

  console.log(`\n------------ Webhook Subscription Details ------------`);
  console.log(`Received payment webhook for subscription: ${reference_id}\nStatus: ${status}\nPayment Method: ${payment_channel || payment_method || 'Unknown'}\nTransaction ID: ${product_id || 'Unknown'}`);

  if (status === 'SUCCEEDED' || status === 'COMPLETED' || status === 'PAID') {
    try {
      let subscriber: Subscriber | null = null;

      // Try finding subscriber by email first
      if (email) {
        subscriber = await Subscriber.findOne({ 
          where: { email: email.toLowerCase() }
        });
        if (subscriber) {
          console.log(`Found subscriber by email: ${email}, ID: ${subscriber.id}`);
        } else {
          console.log(`No subscriber found with email: ${email}`);
        }
      }

      // If not found by email, try by reference_id
      if (!subscriber && reference_id) {
        const subscriberId = isSubscriptionPayment(reference_id) 
          ? reference_id.replace(/^subscription-/, '') 
          : reference_id;
        subscriber = await Subscriber.findOne({ where: { id: subscriberId } });
        
        if (!subscriber) {
          console.error(`No matching subscriber found for reference_id: ${reference_id}${email ? ` and email: ${email}` : ''}`);
          res.status(404).json({ 
            error: 'Subscriber not found',
            details: {
              reference_id,
              email,
              message: 'No pending subscription record found. Ensure subscription is created before payment.'
            }
          });
          return;
        }
      }

      if (!subscriber) {
        console.error('Cannot process webhook: no subscriber found and insufficient data');
        res.status(400).json({ 
          error: 'Invalid webhook data',
          details: { reference_id, email, message: 'Email or valid reference_id required' }
        });
        return;
      }

      // Update subscriber status and dates
      subscriber.status = 'active';
      subscriber.startDate = new Date();
      subscriber.endDate = new Date(new Date().setMonth(new Date().getMonth() + subscriber.duration));
      await subscriber.save();

      const formattedDateTime = new Date().toLocaleString();
      console.log(`
=================== Subscription Receipt ===================
Transaction ID: ${product_id || 'N/A'}
Subscription Reference ID: ${reference_id}
Subscriber ID: ${subscriber.id}
Timestamp: ${formattedDateTime}
Email: ${subscriber.email}
------------------------------------
💳 Payment Details:
Payment Method: ${payment_channel || payment_method || 'Unknown'}
Currency: ${currency}
Paid Amount: ${amount}
------------------------------------
🔄 Subscription Summary:
Subscription Type: ${subscriber.subscriptionType}
Duration: ${subscriber.duration} months
Status: ${subscriber.status}
Start Date: ${subscriber.startDate.toLocaleString()}
End Date: ${subscriber.endDate?.toLocaleString() || 'N/A'}
=======================================================`);

      res.status(200).json({ message: 'Subscription activated' });
    } catch (error: any) {
      console.error('Error handling subscription payment callback:', error.message, '\nStack:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    console.log(`Payment status for subscription ${reference_id}: ${status}`);
    res.status(200).json({ message: `Payment status: ${status}` });
  }
};

// Webhook handler for payment callbacks at buy item
export const handlePaymentCallback = async (req: Request, res: Response): Promise<void> => {
  const {
    id: product_id,
    status,
    external_id: reference_id,
    payer_email: email,
    amount,
    payment_method,
    currency,
    payment_channel,
    user_id,
    description,
    paid_amount,
    created,
    updated,
    paid_at,
    merchant_name,
    payment_destination
  } = req.body;

  const webhookToken = req.headers['x-callback-token'];

  // Verify the webhook token
  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    console.error('Invalid webhook token');
    res.status(401).json({ message: 'Invalid webhook token' });
    return;
  }

  // Check if this is a subscription payment
  if (isSubscriptionPayment(reference_id)) {
    console.log('Redirecting to subscription handler...');
    await handleSubscriptionPaymentCallback(req, res);
    return;
  }

  console.log(`\n------------ Webhook Order Details ------------`);
  console.log(`Received payment webhook for order: ${reference_id}\nStatus: ${status}`);
  const paymentMethod = payment_channel || payment_method || 'Unknown';
  console.log(`Payment Method: ${paymentMethod}`);
  const transactionId = product_id || 'Unknown';
  console.log(`Transaction ID: ${transactionId}`);

  if (status === 'SUCCEEDED' || status === 'COMPLETED' || status === 'PAID') {
    try {
      const referenceIdParts = reference_id.split('-');
      if (referenceIdParts.length !== 6) {
        const errorMsg = {
          message: `Invalid order reference_id format: ${reference_id}`,
          expectedFormat: "order-itemId-itemName-username-date-randomId",
          received: reference_id,
          parts: referenceIdParts,
          length: referenceIdParts.length
        };
        console.error(JSON.stringify(errorMsg, null, 2));
        res.status(400).json(errorMsg);
        return;
      }

      const [, itemId, itemName, username] = referenceIdParts;

      console.log(`Item ID: ${itemId}\nItem Name: ${itemName}\nUsername: ${username}\nProduct ID: ${product_id}`);

      const user = await User.findOne({ where: { username } });
      if (!user) {
        console.error(`User not found for order: ${reference_id}`);
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const item = await getItemDetails(itemId);
      if (!item) {
        console.error(`Item not found for ID: ${itemId}`);
        res.status(404).json({ message: 'Item not found' });
        return;
      }

      // Update user's coins
      user.totalCoins = (user.totalCoins || 0) + item.coins;
      await user.save();

      // Insert order data into Order table
      await Order.create({
        order_id: reference_id,
        email: user.email,
        client_reference_id: transactionId,
        order_details: {
          username: user.username,
          email: user.email,
          item_name: item.name,
          orderId: reference_id,
          received_coins: item.coins,
          payment_method: paymentMethod,
          currency,
          paid_amount: amount,
          created_at: new Date(),
        },
        paid_amount: amount,
        UserId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        received_coins: item.coins
      });

      const formattedDateTime = new Date().toLocaleString();
      console.log(`
=================== Payment Receipt ===================
Transaction ID: ${transactionId}
Order Reference ID: ${reference_id}
Timestamp: ${formattedDateTime}
Username: ${user.username}
Email: ${user.email}
------------------------------------
💳 Payment Details:
Payment Method: ${paymentMethod}
Currency: ${currency}
Paid Amount: ${amount}
------------------------------------
🛒 Purchase Summary:
Purchased Item: ${item.name}
Coins Added: ${item.coins}
Total Coins Balance: ${user.totalCoins}
=======================================================`);

      res.status(200).json({ message: 'Payment confirmed and coins added to user account' });
    } catch (error: any) {
      console.error('Error handling payment callback:', error.message, '\nStack:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else if (status === 'REQUIRES_ACTION') {
    console.log(`Payment requires action for order ${reference_id}. Actions: ${JSON.stringify(req.body.actions, null, 2)}`);
    res.status(200).json({ message: 'Payment requires action', actions: req.body.actions });
  } else {
    console.log(`Payment status for order ${reference_id}: ${status}`);
    res.status(200).json({ message: `Payment status: ${status}` });
  }
};