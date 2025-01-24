import { Request, Response } from 'express';
import User from '../../model/user'; // Import the User model
import dotenv from 'dotenv';
import { getItemDetails } from './shopController'; // Import the getItemDetails function

dotenv.config();

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