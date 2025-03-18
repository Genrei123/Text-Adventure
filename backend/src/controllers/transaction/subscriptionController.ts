import { Request, Response } from 'express';
import { Invoice } from '../../service/transaction/xenditClient';
import Subscriber from '../../model/transaction/SubscriberModel';
import SubscriptionOffers from '../../model/transaction/SubscriptionOffersModel';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import User from '../../model/user/user';

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const SUCCESS_RETURN_URL = `${FRONTEND_URL}/subscription`;
const FAILURE_RETURN_URL = `${FRONTEND_URL}/subscription`;

// Function to generate a random 6-character alphanumeric string (same as in shopController)
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Check if subscription ID exists
const checkSubscriptionIdExists = async (id: string) => {
  const subscription = await Subscriber.findOne({ where: { id } });
  return !!subscription;
};

// Function to determine AI model based on subscription type
const getAIModelForSubscription = (subscriptionType: string): string => {
  switch (subscriptionType) {
    case 'Freedom Sword':
      return 'gpt-3.5-turbo'; // GPT-3.5 & Dall-e 2
    case 'Adventure\'s Entry':
      return 'gpt-3.5-turbo'; // GPT 3.5-turbo & Dall-e 2
    case 'Hero\'s Journey':
      return 'gpt-4o'; // GPT 4o & Dall-e 3
    case 'Legend\'s Legacy':
      return 'gpt-4'; // GPT 4 & ComfyUI & Dall-E 3
    default:
      return 'gpt-3.5-turbo'; // Default to basic model
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  const { email, offerId } = req.body;

  if (!email || !offerId) {
    res.status(400).json({ error: 'email and offerId are required' });
    return;
  }

  let plan: SubscriptionOffers | null = null;

  try {
    // Fetch the plan details from the SubscriptionOffers table
    plan = await SubscriptionOffers.findByPk(offerId);
    if (!plan) {
      res.status(400).json({ error: 'Invalid offerId' });
      return;
    }

    // Check if the subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ where: { email } });
    if (existingSubscriber) {
      res.status(400).json({ error: 'Subscriber with this email already exists' });
      return;
    }

    // Create a well-structured subscription ID (similar to orderId in buyItem)
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    let randomId = generateRandomId();
    let subscriptionId = `sub_${date}_${randomId}`;

    // Ensure the subscription ID is unique
    while (await checkSubscriptionIdExists(subscriptionId)) {
      randomId = generateRandomId();
      subscriptionId = `subscription-sub_${date}_${randomId}`;
    }

    // Create a pending subscription record in the database
    const newSubscriber = await Subscriber.create({
      id: subscriptionId, // Use the well-structured ID
      email,
      subscriptionType: plan.offerName,
      startDate: new Date(), // Assign a default value
      endDate: null, // Set to null initially
      subscribedAt: new Date(),
      status: 'pending', // Add a status field to track the subscription status
      duration: plan.duration, // Assign the duration from the plan
    });

    // UPDATE USER GPT TYPE

    // Create a consistent reference ID format for the external service
    const externalId = `subscription-${subscriptionId}`;

    // Create an invoice using Xendit
    const invoiceData = {
      externalId: externalId,
      amount: plan.price,
      payerEmail: email,
      description: plan.description,
      successRedirectUrl: SUCCESS_RETURN_URL,
      failureRedirectUrl: FAILURE_RETURN_URL,
      currency: 'PHP',
    };

    console.log('Invoice data:', invoiceData);

    const invoice = await Invoice.createInvoice({ data: invoiceData });
    const paymentLink = invoice.invoiceUrl || 'N/A';
    const formattedDate = new Date().toLocaleString();

    console.log(`-------------- Invoice Details --------------`);
    console.log(`Status: Success
Subscription ID: ${newSubscriber.id}
External ID: ${externalId}
Subscription Type: ${plan.offerName}
Email: ${email}
Paid Amount: ${plan.price}
Date Created: ${formattedDate}
Invoice ID: ${invoice.id}
Link To Payment: ${paymentLink}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);
    res.status(201).json({ paymentLink });
  } catch (error: any) {
    const formattedDate = new Date().toLocaleString();
    console.error(` ----------------- Invoice Creation Failed -----------------`);
    console.error(`Status: Fail
Subscription Type: ${plan?.offerName || 'N/A'}
Email: ${email}
Paid Amount: ${plan?.price || 'N/A'}
Date Created: ${formattedDate}
Error: ${error.message}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);
    console.error('Full error object:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('Error request data:', error.request);
      res.status(500).json({ error: 'No response received from Xendit API' });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
};

// Add this new function to handle subscription callback/webhook
export const handleSubscriptionCallback = async (req: Request, res: Response) => {
  const { id, status, paid_amount, external_id } = req.body;
  
  try {
    // Extract subscription ID from external_id (removing 'subscription-' prefix)
    const subscriptionId = external_id.startsWith('subscription-') 
      ? external_id.substring('subscription-'.length) 
      : external_id;
    
    // Find the subscription
    const subscription = await Subscriber.findOne({ where: { id: subscriptionId } });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    if (status === 'PAID' || status === 'SETTLED') {
      // Calculate end date based on start date and duration
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      let value: number;
      let unit: string = 'months'; // Default unit
      
      // Handle both string and number formats for duration
      const duration: string | number = subscription.duration as any; // Cast to workaround type issue
      
      if (typeof duration === 'string') {
        // Handle string format like "3 months"
        const durationParts = duration.split(' ');
        value = parseInt(durationParts[0], 10);
        if (durationParts.length > 1) {
          unit = durationParts[1].toLowerCase();
        }
      } else {
        // If duration is a number, use it directly with default unit (months)
        value = Number(duration);
      }
      
      if (unit.includes('day')) {
        endDate.setDate(endDate.getDate() + value);
      } else if (unit.includes('month')) {
        endDate.setMonth(endDate.getMonth() + value);
      } else if (unit.includes('year')) {
        endDate.setFullYear(endDate.getFullYear() + value);
      }
      
      // Update subscription status to active and set dates
      await subscription.update({
        status: 'active',
        startDate,
        endDate
      });
      
      // Find and update the user's AI model
      const user = await User.findOne({ where: { email: subscription.email } });
      if (user) {
        const aiModel = getAIModelForSubscription(subscription.subscriptionType);
        await user.update({ model: aiModel });
        
        console.log(`-------------- User Model Updated --------------`);
        console.log(`User: ${user.email}
Old Model: ${user.model}
New Model: ${aiModel}
Based on: ${subscription.subscriptionType} subscription
Updated at: ${new Date().toLocaleString()}`);
        console.log(`-----------------------------------------------------`);
      } else {
        console.log(`Warning: User with email ${subscription.email} not found. Model update skipped.`);
      }
      
      return res.status(200).json({ 
        message: 'Subscription activated successfully',
        subscription
      });
    } else if (status === 'EXPIRED') {
      await subscription.destroy();
      return res.status(200).json({ message: 'Subscription expired and deleted' });
    } else {
      // Handle other statuses
      await subscription.update({ status: status.toLowerCase() });
      return res.status(200).json({ message: `Subscription status updated to ${status}` });
    }
  } catch (error: any) {
    console.error('Error processing subscription callback:', error);
    return res.status(500).json({ error: 'Failed to process subscription callback' });
  }
};

export const getSubscriptionOffers = async (req: Request, res: Response): Promise<void> => {
  try {
      // Find all available subscription offers
      const offers = await SubscriptionOffers.findAll();
      res.status(200).json(offers);
  } catch (error) {
      console.error('Error fetching subscription offers:', error);
      res.status(500).json({ error: 'Failed to fetch subscription offers' });
  }
};

export const getUserSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    
    if (!email) {
      res.status(400).json({ error: 'Email parameter is required' });
      return;
    }
    
    // Find all subscriptions for this user
    const subscriptions = await Subscriber.findAll({
      where: { 
        email: { [Op.iLike]: email } // Case insensitive email matching
      }
    });
    
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch user subscriptions' });
  }
};

export const unsubscribeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, subscriptionId } = req.body;
    
    if (!email || !subscriptionId) {
      res.status(400).json({ error: 'Email and subscriptionId are required' });
      return;
    }
    
    // Find the subscription
    const subscription = await Subscriber.findOne({
      where: { 
        id: subscriptionId,
        email: { [Op.iLike]: email }
      }
    });
    
    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }
    
    // Only active subscriptions can be cancelled
    if (subscription.status !== 'active') {
      res.status(400).json({ error: `Cannot unsubscribe a subscription with status: ${subscription.status}` });
      return;
    }
    
    // Delete the subscription record
    await subscription.destroy();
    
    const formattedDate = new Date().toLocaleString();
    console.log(`-------------- Subscription Cancelled --------------`);
    console.log(`Status: Success
Subscription ID: ${subscriptionId}
Email: ${email}
Subscription Type: ${subscription.subscriptionType}
Date Cancelled: ${formattedDate}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);
    
    res.status(200).json({ 
      message: 'Subscription successfully cancelled',
      subscription
    });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};