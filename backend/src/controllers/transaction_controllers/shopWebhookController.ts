import { Request, Response } from 'express';
import User from '../../model/user'; // Import the User model
import Order from '../../model/order'; // Import the Order model
import dotenv from 'dotenv';
import { getItemDetails } from './shopController'; // Import the getItemDetails function

dotenv.config();

// Webhook handler for payment callbacks at buy item
export const handlePaymentCallback = async (req: Request, res: Response): Promise<void> => {
  const { data, event } = req.body;
  const { id: product_id, status, reference_id, email, amount, payment_method } = data;
  const webhookToken = req.headers['x-callback-token'];

  // Verify the webhook token
  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    console.error('Invalid webhook token');
    res.status(401).json({ message: 'Invalid webhook token' });
    return;
  }

  console.log(` `);
  console.log(`------------ Webhook Order Details ------------`);
  console.log(`Received payment webhook for order: ${reference_id}
Status: ${status}
Event: ${event}`);

  // Extract the payment method
  const paymentMethod = payment_method?.ewallet?.channel_code || 'Unknown';
  console.log(`Payment Method: ${paymentMethod}`);

  // Extract the transaction ID
  const transactionId = payment_method?.id || 'Unknown';
  console.log(`Transaction ID: ${transactionId}`);

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
      if (referenceIdParts.length !== 6) {
        console.error(`Invalid reference_id format: ${reference_id}`);
        res.status(400).json({ message: `Invalid reference_id format: ${reference_id}` });
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
          currency: data.currency,
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
Currency: ${data.currency}
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
    console.log(`Payment requires action for order ${reference_id}. Actions: ${JSON.stringify(data.actions, null, 2)}`);
    res.status(200).json({ message: 'Payment requires action', actions: data.actions });
  } else {
    console.log(`Payment status for order ${reference_id}: ${status}`);
    res.status(200).json({ message: `Payment status: ${status}` });
  }
};