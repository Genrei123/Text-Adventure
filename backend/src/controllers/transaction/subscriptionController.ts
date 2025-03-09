import { Request, Response } from 'express';
import { Invoice } from '../../service/transaction/xenditClient';
import Subscriber from '../../model/transaction/SubscriberModel';
import SubscriptionOffers from '../../model/transaction/SubscriptionOffersModel';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

dotenv.config();

const SUCCESS_RETURN_URL = process.env.SUBSCRIPTION_SUCCESS_RETURN_URL;
const FAILURE_RETURN_URL = process.env.SUBSCRIPTION_FAILURE_RETURN_URL;

// Function to generate a random 6-character alphanumeric string (same as in shopController)
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Check if subscription ID exists
const checkSubscriptionIdExists = async (id: string) => {
  const subscription = await Subscriber.findOne({ where: { id } });
  return !!subscription;
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