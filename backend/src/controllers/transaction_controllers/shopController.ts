import { Request, Response } from 'express';
import { PaymentRequest } from '../../service/Xendit Service/xenditClient';
import { PaymentRequestParameters, PaymentRequestCurrency } from 'xendit-node/payment_request/models';
import User from '../../model/user'; // Import the User model
import Item from '../../model/ItemModel'; // Import the Item model
import dotenv from 'dotenv';
import { createCustomer } from '../../service/Xendit Service/Subscription/customerService';
import { createPaymentMethod } from '../../service/Xendit Service/Subscription/paymentMethodService';
import { createSubscriptionPlan } from '../../service/Xendit Service/Subscription/recurringPaymentService';
import { getCoinBalance, deductCoinsByWords } from '../../service/Xendit Service/Item Shop/coinService'; // Import coin service

dotenv.config();

const SUCCESS_RETURN_URL = 'https://example.com/payment-success';
const FAILURE_RETURN_URL = 'https://example.com/payment-failure';

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
  const userId = parseInt(req.params.userId, 10);

  try {
    const coins = await getCoinBalance(userId);
    res.status(200).json({ coins });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Deduct coins based on text input
export const deductCoins = async (req: Request, res: Response) => {
  const { userId, text } = req.body;

  try {
    const wordCount = text.trim().split(/\s+/).length; // Count words in the text
    await deductCoinsByWords(userId, wordCount);
    res.status(200).json({ message: 'Coins deducted successfully' });
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

    // Create an orderId with username and date
    const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Format date as YYYYMMDD
    orderId = `order-${itemId}-${item.name}-${user.username}-${date}`;

    // Create payment method data
    const paymentMethodData = {
      type: 'ewallet',
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

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { customerData, paymentMethodData, planData } = req.body;

    // Create customer
    const customer = await createCustomer(customerData);
    console.log('Customer created:', customer);

    // Create payment method
    paymentMethodData.customer_id = customer.id.toString(); // Convert customer_id to string
    paymentMethodData.context = 'subscription' as 'subscription'; // Explicitly set context as 'subscription'
    const paymentMethod = await createPaymentMethod(paymentMethodData);
    console.log('Payment method created:', paymentMethod);

    // Create subscription plan
    const subscriptionPlanData = {
      reference_id: `sub-${new Date().getTime()}`, // Generate a unique reference ID
      customer_id: customer.id.toString(), // Convert customer_id to string
      recurring_action: 'CHARGE_CUSTOMER', // Set the recurring action
      payment_methods: [{ payment_method_id: paymentMethod.id, rank: 1 }],
      interval: planData.interval,
      interval_count: planData.interval_count,
      total_recurrence: planData.total_recurrence,
      amount: planData.amount,
      currency: planData.currency,
    };

    console.log('Subscription plan data:', subscriptionPlanData);

    const subscriptionPlan = await createSubscriptionPlan(subscriptionPlanData);
    console.log('Subscription plan created:', subscriptionPlan);

    res.status(201).json(subscriptionPlan);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};