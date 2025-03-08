import { Request, Response } from 'express';
import User from '../../model/user/user';
import Order from '../../model/transaction/order';
import dotenv from 'dotenv';
import { getItemDetails } from './shopController';
import Subscriber from '../../model/transaction/SubscriberModel';
import { Op } from 'sequelize';

dotenv.config();

// Define a function to check if reference_id is for a subscription
const isSubscriptionPayment = (reference_id: string) => {
  return reference_id.startsWith('subscription-');
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

  console.log(` `);
  console.log(`------------ Webhook Subscription Details ------------`);
  console.log(`Received payment webhook for subscription: ${reference_id}
Status: ${status}
Payment Method: ${payment_channel || payment_method || 'Unknown'}
Transaction ID: ${product_id || 'Unknown'}`);

  if (status === 'SUCCEEDED' || status === 'COMPLETED' || status === 'PAID') {
    try {
      // Debug: Log the email from the webhook request
      console.log(`Email from webhook: ${email}`);
      
      // Get all subscribers from the database for debugging
      const allSubscribers = await Subscriber.findAll();
      console.log(`Total subscribers in database: ${allSubscribers.length}`);
      
      // Print all subscriber IDs for debugging
      allSubscribers.forEach(sub => {
        console.log(`Subscriber ID: ${sub.id}, Email: ${sub.email}, Status: ${sub.status}`);
      });
      
      // Try to find subscriber by email first (most reliable method)
      let subscriber = null;
      if (email) {
        subscriber = await Subscriber.findOne({ 
          where: { 
            email: email.toLowerCase() // Normalize email to lowercase for comparison
          } 
        });
        
        if (subscriber) {
          console.log(`Found subscriber by email: ${email}, ID: ${subscriber.id}`);
        } else {
          console.log(`Could not find subscriber with email: ${email}`);
        }
      }
      
      // If not found by email, handle ID extraction based on the reference_id format
      if (!subscriber) {
        let subscriberId;
        
        // Handle case when Xendit adds the "subscription-" prefix
        if (reference_id.startsWith("subscription-")) {
          subscriberId = reference_id.substring("subscription-".length);
          console.log(`Extracted subscriber ID from prefixed reference_id: ${subscriberId}`);
        } 
        // Handle case when the ID is used directly (no prefix)
        else if (reference_id.startsWith("sub_")) {
          subscriberId = reference_id;
          console.log(`Using reference_id directly as subscriber ID: ${subscriberId}`);
        }
        // Unknown format - use the entire reference_id
        else {
          subscriberId = reference_id;
          console.log(`Unknown format, using full reference_id: ${subscriberId}`);
        }
        
        subscriber = await Subscriber.findOne({ where: { id: subscriberId } });
        
        // If still not found, report an error instead of creating a new one
        if (!subscriber && email) {
          // Instead of automatically creating a new subscription, log an error
          console.error(`No matching subscriber found for email: ${email} and reference_id: ${reference_id}`);
          res.status(404).json({ 
            error: 'Subscriber not found', 
            details: {
              reference_id: reference_id,
              email: email,
              message: 'No pending subscription record found. The subscription must be created before the payment webhook is received.'
            }
          });
          return;
        } else if (!subscriber) {
          console.error('Cannot process webhook: no subscriber found and no email provided');
          res.status(404).json({ 
            error: 'Subscriber not found and no email provided',
            details: {
              reference_id: reference_id,
              message: 'No pending subscription record found and no email was provided in the webhook.'
            }
          });
          return;
        }
      }

      // Update the subscriber's status and subscription dates
      subscriber.status = 'active';
      subscriber.startDate = new Date();
      subscriber.endDate = new Date(new Date().setMonth(new Date().getMonth() + subscriber.duration));
      await subscriber.save();

      const formattedDateTime = new Date().toLocaleString();
      console.log(`
=================== Subscription Receipt ===================
Transaction ID: ${product_id}
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
      console.error('Error handling subscription payment callback:', error);
      console.error('Full error stack:', error.stack);
      res.status(500).json({ message: 'Server error' });
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
    console.log('This appears to be a subscription payment. Redirecting to subscription handler...');
    return handleSubscriptionPaymentCallback(req, res);
  }

  console.log(` `);
  console.log(`------------ Webhook Order Details ------------`);
  console.log(`Received payment webhook for order: ${reference_id}
Status: ${status}`);

  // Extract the payment method
  const paymentMethod = payment_channel || payment_method || 'Unknown';
  console.log(`Payment Method: ${paymentMethod}`);

  // Extract the transaction ID
  const transactionId = product_id || 'Unknown';
  console.log(`Transaction ID: ${transactionId}`);

  if (status === 'SUCCEEDED' || status === 'COMPLETED' || status === 'PAID') {
    try {
      // Check if reference_id format is as expected
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

      // Extract itemId, itemName, username, date, and randomId from reference_id
      const [orderPrefix, itemId, itemName, username, date, randomId] = referenceIdParts;

      console.log(`Item ID: ${itemId}
Item Name: ${itemName}
Username: ${username}
Date: ${date}
Product ID: ${product_id}`);
      console.log(`Processing payment for order: ${reference_id}`);
      console.log(`-----------------------------------------------`);

      console.log(` `);

      const user = await User.findOne({ where: { username } });

      if (!user) {
        console.log(`User not found for order: ${reference_id}`);
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const item = await getItemDetails(itemId);

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
          currency: currency,
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
Client Reference ID: ${product_id}     

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
      console.error('Error handling payment callback:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (status === 'REQUIRES_ACTION') {
    console.log(`Payment requires action for order ${reference_id}. Actions: ${JSON.stringify(req.body.actions, null, 2)}`);
    res.status(200).json({ message: 'Payment requires action', actions: req.body.actions });
  } else {
    console.log(`Payment status for order ${reference_id}: ${status}`);
    res.status(200).json({ message: `Payment status: ${status}` });
  }
};