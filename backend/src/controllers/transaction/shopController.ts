import { Request, Response } from 'express';
import { PaymentRequest } from '../../service/transaction/xenditClient';
import { PaymentRequestParameters, PaymentRequestCurrency } from 'xendit-node/payment_request/models';
import User from '../../model/user/user'; // Import the User model
import Item from '../../model/transaction/ItemModel'; // Import the Item model
import dotenv from 'dotenv';
import { createPaymentMethod } from '../../service/transaction/Subscription/paymentMethodService';
import { deductCoinsByTokens, checkOrderIdExists } from '../../service/transaction/Item Shop/coinService'; // Import coin service
import { getChatTokenDetails } from '../../utils/tokenizer'; // Import the correct function

dotenv.config();

// Constants for return URLs
const SUCCESS_RETURN_URL = 'https://example.com/payment-success';
const FAILURE_RETURN_URL = 'https://example.com/payment-failure';

// Function to generate a random 6-character alphanumeric string
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Function to fetch item details based on item ID
export const getItemDetails = async (itemId: string) => {
  const item = await Item.findByPk(itemId);
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

// Fetch coin balance
export const getCoins = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const user = await User.findByPk(userId, {
      attributes: ['totalCoins'],
    });

    if (user) {
      res.json({ coins: user.totalCoins });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Deduct coins based on text input
export const deductCoins = async (req: Request, res: Response) => {
  const { userId, messages } = req.body;

  try {
    // Calculate the number of tokens using the tokenizer
    const tokenCount = getChatTokenDetails(messages);

    // Calculate the number of coins to deduct
    const coinsToDeduct = tokenCount; // Assuming 1 coin per token

    await deductCoinsByTokens(userId, messages.map((msg: { role: string; content: string }) => msg.content).join(' '));
    res.status(200).json({ 
      message: 'Coins deducted successfully', 
      coinsDeducted: coinsToDeduct, 
      deductionDetails: `Deducted ${coinsToDeduct} coins for ${tokenCount} tokens (1 coin per token)`,
      tokens: messages 
    });
    console.log(`Messages: ${JSON.stringify(messages)}`);
    console.log(`Coins deducted: ${coinsToDeduct} coins for ${tokenCount} tokens`);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
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

    // Create an orderId with username, date, and a random 6-character alphanumeric string
    const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Format date as YYYYMMDD
    let randomId = generateRandomId();
    orderId = `order-${itemId}-${item.name}-${user.username}-${date}-${randomId}`;

    // Ensure the Order ID is unique
    while (await checkOrderIdExists(orderId)) {
      randomId = generateRandomId();
      orderId = `order-${itemId}-${item.name}-${user.username}-${date}-${randomId}`;
    }

    // Create payment method data
    const paymentMethodData = {
      type: 'EWALLET',
      reusability: 'ONE_TIME_USE',
      ewallet: {
        channel_code: paymentMethod,
        channel_properties: {
          success_return_url: SUCCESS_RETURN_URL,
          failure_return_url: FAILURE_RETURN_URL,
        },
      },
      customer_id: user.id.toString(), // Convert customer_id to string
      metadata: {},
      context: 'buy_item' as 'buy_item', // Explicitly set context as 'buy_item'
    };

    // Create payment method
    const paymentMethodResponse = await createPaymentMethod(paymentMethodData);

    // Create a payment request
    const data: PaymentRequestParameters = {
      amount: item.price,
      paymentMethod: {
        ewallet: {
          channelProperties: {
            successReturnUrl: SUCCESS_RETURN_URL,
            failureReturnUrl: FAILURE_RETURN_URL,
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

    console.log(`-------------- Payment Request Details --------------`)
console.log(`Status: Success
Item ID: ${itemId}
Item Name: ${item.name}
User ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Payment Method: ${paymentMethod}
Paid Amount: ${item.price}
Date Created: ${formattedDate}
Order ID: ${orderId}
Payment Request ID: ${paymentRequest.id}
Link To Payment: ${paymentLink}`);
console.log(`-----------------------------------------------------`);
console.log(` `);
    res.json({ paymentLink });
  } catch (error: any) {
    const formattedDate = new Date().toLocaleString();
    console.error(` ----------------- Payment Request Details -----------------`)
    console.error(`Status: Fail
Item ID: ${itemId}
Item Name: ${item?.name || 'N/A'}
User ID: ${user?.id || 'N/A'}
Username: ${user?.username || 'N/A'}
User Email: ${email}
Payment Method: ${paymentMethod}
Paid Amount: ${item?.price || 'N/A'}
Date Created: ${formattedDate}
Order ID: ${orderId}
Error: ${error.message}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: 'No response received from Xendit API' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};