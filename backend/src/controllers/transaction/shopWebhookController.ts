import { Request, Response } from 'express';
import User from '../../model/user/user';
import Order from '../../model/transaction/order';
import dotenv from 'dotenv';
import { getItemDetails, getTokenPackageDetails, addCoinsToUser } from './shopController';
import Subscriber from '../../model/transaction/SubscriberModel';
import { Op } from 'sequelize';
import TokenPackage from '../../model/transaction/TokenPackageModel'; // Import TokenPackage model
import Item from '../../model/transaction/ItemModel'; // Import Item model

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
  try {
    console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));
    
    // Handle test requests from Postman
    if (req.body.test === true) {
      console.log('Processing test webhook from Postman');
      res.status(200).json({ message: 'Test webhook received and processed successfully' });
      return;
    }
    
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

    // Verify required fields
    if (!reference_id) {
      console.error('Missing reference_id in webhook payload');
      res.status(400).json({ error: 'Missing reference_id' });
      return;
    }

    const webhookToken = req.headers['x-callback-token'];

    // Verify the webhook token except for local testing
    if (process.env.NODE_ENV !== 'development' && webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
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
      // Determine amount to use - prefer 'amount' over 'paid_amount' as it's more reliable
      let paymentAmount = amount || paid_amount || 0;
      console.log(`Using payment amount: ${paymentAmount} (original: amount=${amount}, paid_amount=${paid_amount})`);
      
      // Ensure it's a valid integer
      let paidAmountInt = 0; // Default to 0
      try {
        if (typeof paymentAmount === 'number') {
          paidAmountInt = Math.floor(paymentAmount);
        } else if (typeof paymentAmount === 'string') {
          paidAmountInt = parseInt(paymentAmount, 10);
        }
        
        // Validate the result is a valid number
        if (isNaN(paidAmountInt) || paidAmountInt < 0) {
          console.warn(`Invalid payment amount: ${paymentAmount}, using default of 0`);
          paidAmountInt = 0;
        }
      } catch (error) {
        console.error(`Error converting payment amount: ${error}`);
        paidAmountInt = 0;
      }
      
      console.log(`Final payment amount (integer): ${paidAmountInt}`);
      
      // Parse the reference ID
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

      const [orderType, itemId, itemName, username] = referenceIdParts;

      console.log(`Item ID: ${itemId}\nItem Name: ${itemName}\nUsername: ${username}\nProduct ID: ${product_id}`);

      const user = await User.findOne({ where: { username } });
      if (!user) {
        console.error(`User not found for order: ${reference_id}`);
        res.status(404).json({ message: 'User not found' });
        return;
      }

      let item;
      try {
        if (reference_id.startsWith('token-')) {
          item = await getTokenPackageDetails(itemId);
          console.log('Retrieved token package:', item);
        } else {
          item = await getItemDetails(itemId);
        }
  
        if (!item) {
          console.error(`Item not found for ID: ${itemId}`);
          res.status(404).json({ message: 'Item not found' });
          return;
        }
      } catch (error: any) {
        console.error(`Error fetching item details: ${error}`);
        res.status(500).json({ message: 'Error fetching item details', error: error.message });
        return;
      }

      try {
        // Handle token packages differently from regular items
        let coinsToAdd = 0;
        
        if (reference_id.startsWith('token-')) {
          // For token packages, use tokens + bonus
          const tokenPackage = item as any; // Cast to any to avoid TypeScript errors
          coinsToAdd = (tokenPackage.tokens || 0) + (tokenPackage.bonus || 0);
          console.log(`Token package: ${tokenPackage.tokens} tokens + ${tokenPackage.bonus} bonus = ${coinsToAdd} total`);
        } else {
          // For regular items (if they have coins property)
          coinsToAdd = item.coins || 0;
        }
        
        const currentCoins = user.totalCoins || 0;
        
        // Update user's coins
        try {
          user.totalCoins = currentCoins + coinsToAdd;
          await user.save();
          console.log(`Updated user coins: ${currentCoins} + ${coinsToAdd} = ${user.totalCoins}`);
        } catch (userUpdateError: any) {
          console.error('Error updating user coins:', userUpdateError);
          res.status(500).json({ message: 'Error updating user coins', error: userUpdateError.message });
          return;
        }

        // Create order details object with appropriate fields based on item type
        const orderDetails = reference_id.startsWith('token-') ? {
          username: user.username,
          email: user.email,
          item_name: item.name,
          orderId: reference_id,
          received_coins: coinsToAdd,
          payment_method: paymentMethod,
          currency: currency || 'USD',
          paid_amount: paidAmountInt,
          created_at: new Date().toISOString(),
          baseTokens: (item as any).tokens || 0,
          bonusTokens: (item as any).bonus || 0,
          totalTokens: coinsToAdd
        } : {
          username: user.username,
          email: user.email,
          item_name: item.name,
          orderId: reference_id,
          received_coins: coinsToAdd,
          payment_method: paymentMethod,
          currency: currency || 'USD',
          paid_amount: paidAmountInt,
          created_at: new Date().toISOString(),
        };

        try {
          // Create order record
          const orderData = {
            order_id: reference_id,
            email: user.email,
            client_reference_id: transactionId,
            order_details: orderDetails, 
            paid_amount: paidAmountInt,
            UserId: user.id,
            received_coins: coinsToAdd,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
          
          // Check if order already exists
          const existingOrder = await Order.findOne({ where: { order_id: reference_id } });
          
          if (existingOrder) {
            console.log(`Order ${reference_id} already exists, updating...`);
            existingOrder.client_reference_id = transactionId;
            existingOrder.paid_amount = paidAmountInt;
            existingOrder.received_coins = coinsToAdd;
            existingOrder.order_details = orderDetails;
            await existingOrder.save();
            console.log('Order updated successfully');
          } else {
            const newOrder = await Order.create(orderData);
            console.log(`New order created with ID: ${newOrder.id}`);
          }
        } catch (orderError: any) {
          console.error('Error creating/updating order:', orderError);
          console.error('SQL:', orderError.sql);
          console.error('Parameters:', orderError.parameters);
          res.status(500).json({ message: 'Error creating order record', error: orderError.message });
          return;
        }

        const formattedDateTime = new Date().toLocaleString();
        const purchaseSummary = reference_id.startsWith('token-') ?
          `🛒 Purchase Summary:
Purchased Item: ${item.name}
Base Tokens: ${(item as any).tokens || 0}
Bonus Tokens: ${(item as any).bonus || 0}
Total Tokens Added: ${coinsToAdd}
Total Coins Balance: ${user.totalCoins}` :
          `🛒 Purchase Summary:
Purchased Item: ${item.name}
Coins Added: ${coinsToAdd}
Total Coins Balance: ${user.totalCoins}`;

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
Currency: ${currency || 'USD'}
Paid Amount: ${paidAmountInt}
------------------------------------
${purchaseSummary}
=======================================================`);

        res.status(200).json({ message: 'Payment confirmed and coins added to user account' });
      } catch (processError: any) {
        console.error('Error processing payment:', processError);
        res.status(500).json({ 
          message: 'Error processing payment', 
          error: processError.message 
        });
      }
    } else if (status === 'REQUIRES_ACTION') {
      console.log(`Payment requires action for order ${reference_id}. Actions: ${JSON.stringify(req.body.actions || {}, null, 2)}`);
      res.status(200).json({ message: 'Payment requires action', actions: req.body.actions });
    } else {
      console.log(`Payment status for order ${reference_id}: ${status}`);
      res.status(200).json({ message: `Payment status: ${status}` });
    }
  } catch (error: any) {
    console.error('Error handling payment callback:', error.message, '\nStack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Webhook handler for successful payments
export const handlePaymentWebhook = async (req: Request, res: Response) => {
  try {
    console.log('Received webhook payload for handlePaymentWebhook:', JSON.stringify(req.body, null, 2));
    
    const { external_id, status, id: invoice_id, paid_amount, paid_at } = req.body;
    console.log('Webhook received:', { external_id, status, invoice_id, paid_amount, paid_at });

    if (status === 'PAID') {
      let existingOrder = await Order.findOne({ where: { order_id: external_id } });
      console.log('Existing order:', existingOrder);

      if (external_id.startsWith('token-')) {
        const [type, packageId, ...rest] = external_id.split('-');
        const username = rest.slice(2, -2).join('-'); // Extract username

        const user = await User.findOne({ where: { username } });
        if (!user) {
          console.error(`User not found for payment: ${username}`);
          throw new Error('User not found for payment');
        }

        const tokenPackage = await TokenPackage.findByPk(packageId);
        if (!tokenPackage) {
          console.error(`Token package not found: ${packageId}`);
          throw new Error('Token package not found');
        }

        console.log(`Token package details: id=${tokenPackage.id}, name=${tokenPackage.name}, tokens=${tokenPackage.tokens}, bonus=${tokenPackage.bonus}`);

        const totalTokens = tokenPackage.tokens + tokenPackage.bonus;
        console.log(`Adding ${totalTokens} tokens to user ${user.username} (${user.id})`);
        
        try {
          await addCoinsToUser(user.id, totalTokens);
          console.log(`Successfully added ${totalTokens} tokens to user ${user.username}`);
        } catch (error) {
          console.error('Error adding coins to user:', error);
          throw error;
        }

        // Ensure paid_amount is an integer
        let paidAmountInt;
        try {
          paidAmountInt = parseInt(paid_amount?.toString() || tokenPackage.price.toString(), 10);
          if (isNaN(paidAmountInt)) {
            console.warn(`Invalid paid_amount: ${paid_amount}, using price from tokenPackage: ${tokenPackage.price}`);
            paidAmountInt = Math.floor(Number(tokenPackage.price));
          }
          console.log(`Final payment amount: ${paidAmountInt}`);
        } catch (error) {
          console.error('Error converting paid_amount:', error);
          throw new Error('Invalid paid amount');
        }

        if (existingOrder) {
          console.log(`Updating existing order: ${existingOrder.id}`);
          existingOrder.client_reference_id = invoice_id;
          existingOrder.paid_amount = paidAmountInt;
          existingOrder.received_coins = totalTokens;
          existingOrder.order_details = {
            ...existingOrder.order_details,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID',
            baseTokens: tokenPackage.tokens,
            bonusTokens: tokenPackage.bonus,
            totalTokens: totalTokens,
          };
          await existingOrder.save();
          console.log(`Updated order ${external_id} with received_coins: ${totalTokens}`);
        } else {
          console.log(`Creating new order for ${external_id}`);
          const orderDetails = {
            packageId,
            packageName: tokenPackage.name,
            baseTokens: tokenPackage.tokens,
            bonusTokens: tokenPackage.bonus,
            totalTokens,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID',
          };
          await Order.create({
            order_id: external_id,
            email: user.email,
            client_reference_id: invoice_id,
            order_details: orderDetails,
            paid_amount: paidAmountInt,
            UserId: user.id,
            received_coins: totalTokens,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`Created new order ${external_id} with received_coins: ${totalTokens}`);
        }
      } else if (external_id.startsWith('order-')) {
        const [type, itemId, ...rest] = external_id.split('-');
        const username = rest.slice(2, -2).join('-');

        const user = await User.findOne({ where: { username } });
        if (!user) throw new Error('User not found for payment');

        const item = await Item.findByPk(itemId);
        if (!item) throw new Error('Item not found');

        if (item.coins && item.coins > 0) {
          await addCoinsToUser(user.id, item.coins);
          console.log(`Added ${item.coins} coins to user ${user.username} from item purchase`);
        }

        // Ensure paid_amount is an integer
        let paidAmountInt;
        try {
          paidAmountInt = parseInt(paid_amount?.toString() || item.price.toString(), 10);
          if (isNaN(paidAmountInt)) {
            console.warn(`Invalid paid_amount: ${paid_amount}, using price from item: ${item.price}`);
            paidAmountInt = Math.floor(Number(item.price));
          }
        } catch (error) {
          console.error('Error converting paid_amount:', error);
          throw new Error('Invalid paid amount');
        }

        if (existingOrder) {
          existingOrder.client_reference_id = invoice_id;
          existingOrder.paid_amount = paidAmountInt;
          existingOrder.received_coins = item.coins || 0;
          existingOrder.order_details = {
            ...existingOrder.order_details,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID',
          };
          await existingOrder.save();
          console.log(`Updated order ${external_id} with received_coins: ${item.coins || 0}`);
        } else {
          const orderDetails = {
            itemId,
            itemName: item.name,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID',
          };
          await Order.create({
            order_id: external_id,
            email: user.email,
            client_reference_id: invoice_id,
            order_details: orderDetails,
            paid_amount: paidAmountInt,
            UserId: user.id,
            received_coins: item.coins || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`Created new order ${external_id} with received_coins: ${item.coins || 0}`);
        }
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Error processing payment webhook:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};