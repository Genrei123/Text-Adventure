import { Request, Response } from 'express';
import { Invoice } from '../../service/transaction/xenditClient';
import User from '../../model/user/user';
import Item from '../../model/transaction/ItemModel';
import Order from '../../model/transaction/order'; // Import the Order model
import dotenv from 'dotenv';
import { deductCoinsByTokens, checkOrderIdExists } from '../../service/transaction/Item Shop/coinService';
import { getChatTokenDetails } from '../../utils/tokenizer';
import TokenPackage from '../../model/transaction/TokenPackageModel';

dotenv.config();

// Constants for return URLs
const SUCCESS_RETURN_URL = process.env.SUCCESS_RETURN_URL;
const FAILURE_RETURN_URL = process.env.FAILURE_RETURN_URL;

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
  const { packageId, email } = req.body;

  let tokenPackage;
  let user;
  let orderId;

  try {
    // Fetch token package details and user details from your database
    tokenPackage = await getTokenPackageDetails(packageId);
    user = await getUserDetailsByEmail(email);

    // Create an orderId with username, date, and a random 6-character alphanumeric string
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    let randomId = generateRandomId();
    orderId = `token-${packageId}-${tokenPackage.name}-${user.username}-${date}-${randomId}`;

    // Ensure the Order ID is unique
    while (await checkOrderIdExists(orderId)) {
      randomId = generateRandomId();
      orderId = `token-${packageId}-${tokenPackage.name}-${user.username}-${date}-${randomId}`;
    }

    // Create an invoice using Xendit Invoice API
    const invoiceData = {
      externalId: orderId,
      amount: tokenPackage.price,
      payerEmail: email,
      description: `Purchase of ${tokenPackage.name} (${tokenPackage.tokens + tokenPackage.bonus} tokens)`,
      successRedirectUrl: SUCCESS_RETURN_URL,
      failureRedirectUrl: FAILURE_RETURN_URL,
      currency: tokenPackage.currency,
    };

    console.log('Token Package Invoice data:', invoiceData);

    const invoice = await Invoice.createInvoice({ data: invoiceData });
    const paymentLink = invoice.invoiceUrl || 'N/A';
    const formattedDate = new Date().toLocaleString();

    // Create Order record in the database
    await Order.create({
      order_id: orderId,
      email: email,
      client_reference_id: invoice.id || 'N/A',
      order_details: { 
        packageId, 
        packageName: tokenPackage.name,
        tokens: tokenPackage.tokens,
        bonus: tokenPackage.bonus,
        paymentLink
      },
      paid_amount: Math.round(tokenPackage.price),
      UserId: user.id,
      received_coins: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`-------------- Token Package Invoice Details --------------`);
    console.log(`Status: Success
Package ID: ${packageId}
Package Name: ${tokenPackage.name}
Tokens: ${tokenPackage.tokens} + ${tokenPackage.bonus} bonus
User ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Paid Amount: ${tokenPackage.price} ${tokenPackage.currency}
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
Package ID: ${packageId}
Package Name: ${tokenPackage?.name || 'N/A'}
User ID: ${user?.id || 'N/A'}
Username: ${user?.username || 'N/A'}
User Email: ${email}
Paid Amount: ${tokenPackage?.price || 'N/A'} ${tokenPackage?.currency || 'PHP'}
Date Created: ${formattedDate}
Order ID: ${orderId}
Error: ${error.message}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);

    // Create Order record for the failed transaction
    await Order.create({
      order_id: orderId || `failed-token-${packageId}-${Date.now()}`,
      email: email,
      client_reference_id: 'N/A',
      order_details: { packageId, packageName: tokenPackage?.name },
      paid_amount: tokenPackage?.price || 0,
      UserId: user?.id,
      received_coins: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

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

// Webhook handler for successful payments
export const handlePaymentWebhook = async (req: Request, res: Response) => {
  try {
    const { external_id, status, id: invoice_id, paid_amount, paid_at } = req.body;
    
    if (status === 'PAID') {
      // Find the existing order first
      let existingOrder = await Order.findOne({ where: { order_id: external_id } });
      
      // Check if this is a token package purchase
      if (external_id.startsWith('token-')) {
        const [type, packageId, ...rest] = external_id.split('-');
        const lastPart = rest[rest.length - 1];
        const username = rest.slice(2, -2).join('-'); // Extract username
        
        // Find the user
        const user = await User.findOne({ where: { username } });
        if (!user) {
          throw new Error('User not found for payment');
        }
        
        // Find the token package
        const tokenPackage = await TokenPackage.findByPk(packageId);
        if (!tokenPackage) {
          throw new Error('Token package not found');
        }
        
        // Add tokens to user account
        const totalTokens = tokenPackage.tokens + tokenPackage.bonus;
        await addCoinsToUser(user.id, totalTokens);
        
        // Update the existing order or create a new one if it doesn't exist
        if (existingOrder) {
          // Update existing order with payment confirmation details
          existingOrder.client_reference_id = invoice_id;
          existingOrder.paid_amount = paid_amount || Math.round(tokenPackage.price);
          existingOrder.received_coins = totalTokens;
          existingOrder.order_details = {
            ...existingOrder.order_details,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID',
            baseTokens: tokenPackage.tokens,
            bonusTokens: tokenPackage.bonus,
            totalTokens: totalTokens
          };
          await existingOrder.save();
          
          console.log(`Updated order ${external_id} and added ${totalTokens} tokens to user ${user.username}`);
        } else {
          // Create a new order record if one doesn't exist
          const orderDetails = {
            packageId: packageId,
            packageName: tokenPackage.name,
            baseTokens: tokenPackage.tokens,
            bonusTokens: tokenPackage.bonus,
            totalTokens: totalTokens,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID'
          };
          
          await Order.create({
            order_id: external_id,
            email: user.email,
            client_reference_id: invoice_id,
            order_details: orderDetails,
            paid_amount: paid_amount || Math.round(tokenPackage.price),
            UserId: user.id,
            received_coins: totalTokens,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log(`Created new order record and added ${totalTokens} tokens to user ${user.username}`);
        }
      } 
      // Handle regular item purchases
      else if (external_id.startsWith('order-')) {
        const [type, itemId, ...rest] = external_id.split('-');
        const username = rest.slice(2, -2).join('-'); // Extract username
        
        // Find the user
        const user = await User.findOne({ where: { username } });
        if (!user) {
          throw new Error('User not found for payment');
        }
        
        // Find the item
        const item = await Item.findByPk(itemId);
        if (!item) {
          throw new Error('Item not found');
        }
        
        // Add coins from item if applicable
        if (item.coins && item.coins > 0) {
          await addCoinsToUser(user.id, item.coins);
          console.log(`Added ${item.coins} coins to user ${user.username} from item purchase`);
        }
        
        // Update existing order or create a new one
        if (existingOrder) {
          // Update existing order with payment confirmation details
          existingOrder.client_reference_id = invoice_id;
          existingOrder.paid_amount = paid_amount || Math.round(item.price);
          existingOrder.received_coins = item.coins || 0;
          existingOrder.order_details = {
            ...existingOrder.order_details,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID'
          };
          await existingOrder.save();
          
          console.log(`Updated order ${external_id} for item purchase: ${item.name} by user ${user.username}`);
        } else {
          // Create a new order record if one doesn't exist
          const orderDetails = {
            itemId: itemId,
            itemName: item.name,
            paymentId: invoice_id,
            paidAt: paid_at,
            paymentStatus: 'PAID'
          };
          
          await Order.create({
            order_id: external_id,
            email: user.email,
            client_reference_id: invoice_id,
            order_details: orderDetails,
            paid_amount: paid_amount || Math.round(item.price),
            UserId: user.id,
            received_coins: item.coins || 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log(`Created new order record for item purchase: ${item.name} by user ${user.username}`);
        }
      }
    }
    
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Error processing payment webhook:', error.message);
    res.status(500).json({ error: error.message });
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