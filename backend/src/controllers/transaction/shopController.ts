import { Request, Response } from 'express';
import { Invoice } from '../../service/transaction/xenditClient';
import User from '../../model/user/user';
import Item from '../../model/transaction/ItemModel';
import Order from '../../model/transaction/order'; // Import the Order model
import dotenv from 'dotenv';
import { deductCoinsByTokens, checkOrderIdExists } from '../../service/transaction/Item Shop/coinService';
import { getChatTokenDetails } from '../../utils/tokenizer';
import TokenPackage from '../../model/transaction/TokenPackageModel';
import { model } from 'mongoose';

dotenv.config();

// Constants for return URLs
const FRONTEND_URL = process.env.FRONTEND_URL;
const SUCCESS_RETURN_URL = `${FRONTEND_URL}/shop?status=success`;
const FAILURE_RETURN_URL = `${FRONTEND_URL}/shop?status=failure`;

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

// Function to fetch token package details based on package ID
export const getTokenPackageDetails = async (packageId: string) => {
  const tokenPackage = await TokenPackage.findByPk(packageId);
  if (!tokenPackage) {
    throw new Error('Token package not found');
  }
  return tokenPackage;
};

// Function to fetch all items
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Function to fetch all token packages
export const getAllTokenPackages = async (req: Request, res: Response) => {
  try {
    const packages = await TokenPackage.findAll();
    res.json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
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
export const getCoins = async (req: Request, res: Response): Promise<void> => {
  const email = req.query.email as string;

  if (!email) {
    res.status(400).json({ error: 'Email query parameter is required' });
    return;
  }

  try {
    const user = await User.findOne({ where: { email }, attributes: ['totalCoins'] });

    if (user) {
      res.json({ coins: user.totalCoins });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add coins to user account after token package purchase
export const addCoinsToUser = async (userId: string | number, tokens: number): Promise<void> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Add tokens to the user's account
    user.totalCoins = (user.totalCoins || 0) + tokens;
    await user.save();

    console.log(`Added ${tokens} tokens to user ${userId}. New balance: ${user.totalCoins}`);
  } catch (error: any) {
    console.error(`Failed to add tokens to user: ${error.message}`);
    throw error;
  }
};

// Deduct coins based on text input
// Deduct coins based on fixed Weavel cost (1 coin per interaction)
export const deductCoins = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, userId, weavel = true, type = "interaction" } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Fetch user details
    const user = await getUserDetailsByEmail(email);

    // SAGE Weavel system: always deducts exactly 1 coin per interaction
    const WEAVEL_COST = 1;
    const coinsToDeduct = WEAVEL_COST;

    console.log(`Deducting fixed Weavel cost for user ${user.id}: ${coinsToDeduct} coins for ${type}`);

    // Check if user has enough coins
    if (user.totalCoins < coinsToDeduct) {
      res.status(402).json({
        error: 'Not enough Weavels',
        required: coinsToDeduct,
        available: user.totalCoins
      });
      return;
    }

    // Deduct coins
    user.totalCoins -= coinsToDeduct;
    await user.save();

    res.json({
      message: 'Weavel deducted successfully',
      coinsDeducted: coinsToDeduct,
      remainingCoins: user.totalCoins,
      type: type
    });
  } catch (error: any) {
    console.error('Error in deductCoins:', error);
    res.status(500).json({ error: error.message || 'An error occurred while deducting Weavels' });
  }
};

export const buyItem = async (req: Request, res: Response) => {
  const { itemId, email } = req.body;

  let item;
  let user;
  let orderId;

  try {
    // Fetch item details and user details from your database
    item = await getItemDetails(itemId);
    user = await getUserDetailsByEmail(email);

    // Create an orderId with username, date, and a random 6-character alphanumeric string
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    let randomId = generateRandomId();
    orderId = `order-${itemId}-${item.name}-${user.username}-${date}-${randomId}`;

    // Ensure the Order ID is unique
    while (await checkOrderIdExists(orderId)) {
      randomId = generateRandomId();
      orderId = `order-${itemId}-${item.name}-${user.username}-${date}-${randomId}`;
    }

    // Create an invoice using Xendit Invoice API
    const invoiceData = {
      externalId: orderId,
      amount: item.price,
      payerEmail: email,
      description: `Purchase of ${item.name}`,
      successRedirectUrl: SUCCESS_RETURN_URL,
      failureRedirectUrl: FAILURE_RETURN_URL,
      currency: 'PHP',
    };

    console.log('Invoice data:', invoiceData);

    const invoice = await Invoice.createInvoice({ data: invoiceData }); // Using the correct method from InvoiceApi
    const paymentLink = invoice.invoiceUrl || 'N/A';
    const formattedDate = new Date().toLocaleString();

    // Create Order record in the database
    await Order.create({
      order_id: orderId,
      email: email,
      client_reference_id: invoice.id || 'N/A',
      order_details: {
        itemId,
        itemName: item.name,
        paymentLink
      },
      paid_amount: Math.round(item.price),
      UserId: user.id,
      received_coins: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`-------------- Invoice Details --------------`);
    console.log(`Status: Success
Item ID: ${itemId}
Item Name: ${item.name}
User ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Paid Amount: ${item.price}
Date Created: ${formattedDate}
Order ID: ${orderId}
Invoice ID: ${invoice.id}
Link To Payment: ${paymentLink}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);
    res.json({ paymentLink });
  } catch (error: any) {
    const formattedDate = new Date().toLocaleString();
    console.error(` ----------------- Invoice Creation Failed -----------------`);
    console.error(`Status: Fail
Item ID: ${itemId}
Item Name: ${item?.name || 'N/A'}
User ID: ${user?.id || 'N/A'}
Username: ${user?.username || 'N/A'}
User Email: ${email}
Paid Amount: ${item?.price || 'N/A'}
Date Created: ${formattedDate}
Order ID: ${orderId}
Error: ${error.message}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: 'No response received from Xendit API' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// New function to purchase token packages
export const buyTokenPackage = async (req: Request, res: Response) => {
  const { packageId, email, gameId } = req.body;  // Accept gameId from the request

  let tokenPackage;
  let user;
  let orderId;

  try {
    // Validate input
    if (!packageId || !email) {
      throw new Error('Missing packageId or email');
    }

    // Fetch token package details and user details from your database
    tokenPackage = await getTokenPackageDetails(packageId);
    if (!tokenPackage) throw new Error('Token package not found');

    user = await getUserDetailsByEmail(email);
    if (!user) throw new Error('User not found');

    // Ensure price is a valid number and convert to integer
    const price = parseInt(tokenPackage.price.toString(), 10);
    if (isNaN(price)) {
      throw new Error('Invalid price value in token package');
    }

    // Create an orderId with username, date, and a random 6-character alphanumeric string
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    let randomId = generateRandomId();
    orderId = `token-${packageId}-${tokenPackage.name}-${user.username}-${date}-${randomId}`;

    // Ensure the Order ID is unique
    while (await checkOrderIdExists(orderId)) {
      randomId = generateRandomId();
      orderId = `token-${packageId}-${tokenPackage.name}-${user.username}-${date}-${randomId}`;
    }

    // Create dynamic return URLs that include the gameId if provided
    const successUrl = gameId
      ? `${FRONTEND_URL}/shop?status=success&gameId=${gameId}&cleared=true&tokens=${tokenPackage.tokens}`
      : `${FRONTEND_URL}/shop?status=success&cleared=true&tokens=${tokenPackage.tokens}`;

    const failureUrl = gameId
      ? `${FRONTEND_URL}/shop?status=failure&gameId=${gameId}`
      : `${FRONTEND_URL}/shop?status=failure`;

    // Create an invoice using Xendit Invoice API
    const invoiceData = {
      externalId: orderId,
      amount: price,
      payerEmail: email,
      description: `Purchase of ${tokenPackage.name} (${tokenPackage.tokens} tokens)`,
      successRedirectUrl: successUrl,  // Use dynamic URL
      failureRedirectUrl: failureUrl,  // Use dynamic URL
      currency: tokenPackage.currency,
    };

    console.log('Token Package Invoice data:', invoiceData);

    const invoice = await Invoice.createInvoice({ data: invoiceData });
    const paymentLink = invoice.invoiceUrl || 'N/A';
    const formattedDate = new Date().toLocaleString();

    // Create Order record in the database with integer paid_amount
    await Order.create({
      order_id: orderId,
      email: email,
      client_reference_id: invoice.id || 'N/A',
      order_details: {
        packageId,
        packageName: tokenPackage.name,
        tokens: tokenPackage.tokens,
        bonus: tokenPackage.bonus,
        paymentLink,
      },
      paid_amount: price, // Integer value
      UserId: user.id,
      received_coins: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`-------------- Token Package Invoice Details --------------`);
    console.log(`Status: Success
Package ID: ${packageId}
Package Name: ${tokenPackage.name}
Tokens: ${tokenPackage.tokens} + ${tokenPackage.bonus} bonus
User ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Paid Amount: ${price} ${tokenPackage.currency}
Date Created: ${formattedDate}
Order ID: ${orderId}
Invoice ID: ${invoice.id}
Link To Payment: ${paymentLink}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);

    res.json({ paymentLink });
  } catch (error: any) {
    const formattedDate = new Date().toLocaleString();
    console.error(` ----------------- Token Package Invoice Creation Failed -----------------`);
    console.error(`Status: Fail
Package ID: ${packageId || 'N/A'}
Package Name: ${tokenPackage?.name || 'N/A'}
User ID: ${user?.id || 'N/A'}
Username: ${user?.username || 'N/A'}
User Email: ${email || 'N/A'}
Paid Amount: ${tokenPackage?.price || 'N/A'} ${tokenPackage?.currency || 'PHP'}
Date Created: ${formattedDate}
Order ID: ${orderId || 'N/A'}
Error: ${error.message}`);
    console.error('Stack:', error.stack);
    console.log(`-----------------------------------------------------`);
    console.log(` `);

    // Only create a failed order if we have enough data
    if (email && packageId) {
      try {
        await Order.create({
          order_id: orderId || `failed-token-${packageId}-${Date.now()}`,
          email: email,
          client_reference_id: 'N/A',
          order_details: { packageId, packageName: tokenPackage?.name || 'N/A' },
          paid_amount: tokenPackage ? parseInt(tokenPackage.price.toString(), 10) || 0 : 0,
          UserId: user?.id || null,
          received_coins: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (innerError: any) {
        console.error('Failed to create failed order record:', innerError.message);
      }
    }

    if (error.response) {
      console.error('Error response data:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: 'No response received from Xendit API' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// New endpoint to get order history for a user
export const getUserOrderHistory = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const orders = await Order.findAll({
      where: { email: email as string },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching order history:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get token limits
export const getTokenLimits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { getTokenLimits } = require('../../utils/tokenValidator');

    res.json(getTokenLimits());
  } catch (error: any) {
    console.error('Error getting token limits:', error);
    res.status(500).json({ error: error.message || 'An error occurred while getting token limits' });
  }
};