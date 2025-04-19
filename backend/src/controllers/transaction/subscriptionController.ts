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
  const { email, offerId, cleanupPending } = req.body;

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

    // If cleanupPending flag is set, remove any pending subscriptions for this user
    if (cleanupPending) {
      console.log(`Cleaning up pending subscriptions for email: ${email}`);
      await Subscriber.destroy({
        where: {
          email,
          status: 'pending'
        }
      });
    }

    // Check if the subscriber already has an ACTIVE subscription
    // Only block new subscription if user has an active or cancelled subscription
    const existingActiveSubscriber = await Subscriber.findOne({
      where: {
        email,
        status: {
          [Op.in]: ['active', 'cancelled'] // Only block if there's an active/cancelled subscription
        }
      }
    });

    if (existingActiveSubscriber) {
      res.status(400).json({
        error: 'User already has an active subscription. Please cancel current subscription before starting a new one.'
      });
      return;
    }

    // Create a well-structured subscription ID
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

    // Update the user's AI model in the User table
    const user = await User.findOne({ where: { email } });
    if (user) {
      const aiModel = getAIModelForSubscription(plan.offerName);
      await user.update({ model: aiModel });
      console.log(`User's AI model updated to ${aiModel} for subscription type ${plan.offerName}`);
    } else {
      console.log(`Warning: User with email ${email} not found. Model update skipped.`);
    }

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
export const handleSubscriptionCallback = async (req: Request, res: Response): Promise<void> => {
  const { id, status, paid_amount, external_id } = req.body;

  try {
    // Validate required fields
    if (!id || !status || !external_id) {
      res.status(400).json({ error: 'Missing required fields in the request body' });
      return;
    }

    // Extract subscription ID from external_id (removing 'subscription-' prefix)
    const subscriptionId = external_id.startsWith('subscription-')
      ? external_id.substring('subscription-'.length)
      : external_id;

    // Find the subscription
    const subscription = await Subscriber.findOne({ where: { id: subscriptionId } });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    if (status === 'PAID' || status === 'SETTLED') {
      // Calculate end date based on start date and duration
      const startDate = new Date();
      const endDate = new Date(startDate);

      let value: number;
      let unit: string = 'months'; // Default unit

      // Handle both string and number formats for duration
      const duration: string | number = subscription.duration as any;

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

      res.status(200).json({
        message: 'Subscription activated successfully',
        subscription
      });
    } else if (status === 'EXPIRED') {
      // Delete the subscription record
      await subscription.destroy();

      // Revert the user's AI model to the default (Freedom Sword)
      const user = await User.findOne({ where: { email: subscription.email } });
      if (user) {
        const aiModel = getAIModelForSubscription('Freedom Sword');
        await user.update({ model: aiModel });

        console.log(`-------------- User Model Reverted --------------`);
        console.log(`User: ${user.email}
New Model: ${aiModel}
Reason: Subscription expired
Updated at: ${new Date().toLocaleString()}`);
        console.log(`-----------------------------------------------------`);
      }

      res.status(200).json({ message: 'Subscription expired and deleted' });
    } else {
      // Handle other statuses
      await subscription.update({ status: status.toLowerCase() });
      res.status(200).json({ message: `Subscription status updated to ${status}` });
    }
  } catch (error: any) {
    console.error('Error processing subscription callback:', error);
    res.status(500).json({ error: 'Failed to process subscription callback' });
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

    // First, automatically clean up stale pending subscriptions
    await cleanupStalePendingSubscriptions(email);

    // Find all subscriptions for this user, ordered by most recent first
    const subscriptions = await Subscriber.findAll({
      where: {
        email: { [Op.iLike]: email }
      },
      order: [
        ['subscribedAt', 'DESC'] // Most recent subscriptions first
      ]
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch user subscriptions' });
  }
};

// Helper function to get the most recent active subscription for a user
export const getActiveSubscription = async (email: string): Promise<Subscriber | null> => {
  const subscription = await Subscriber.findOne({
    where: {
      email: { [Op.iLike]: email },
      status: {
        [Op.in]: ['active', 'cancelled'] // Include both active and cancelled (since they still have access)
      }
    },
    order: [
      ['subscribedAt', 'DESC'] // Most recent first
    ]
  });

  return subscription;
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

    // Update the subscription status to 'cancelled' but keep the record
    // This allows the user to keep access until the end date
    await subscription.update({
      status: 'cancelled',
      // Keep endDate as is - user will have access until this date
    });

    const formattedDate = new Date().toLocaleString();
    console.log(`-------------- Subscription Cancelled --------------`);
    console.log(`Status: Success
Subscription ID: ${subscriptionId}
Email: ${email}
Subscription Type: ${subscription.subscriptionType}
Date Cancelled: ${formattedDate}
Access Valid Until: ${subscription.endDate?.toLocaleString() || 'N/A'}`);
    console.log(`-----------------------------------------------------`);
    console.log(` `);

    res.status(200).json({
      message: 'Subscription successfully cancelled. You will have access until your subscription period ends.',
      subscription
    });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

export const expireSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, subscriptionId } = req.body;

    if (!email || !subscriptionId) {
      res.status(400).json({ error: 'Email and subscriptionId are required' });
      return;
    }

    console.log('Request Body:', req.body);

    // Normalize subscriptionId if it has a prefix
    const normalizedSubscriptionId = subscriptionId.startsWith('subscription-')
      ? subscriptionId.substring('subscription-'.length)
      : subscriptionId;

    console.log(`Normalized Subscription ID: ${normalizedSubscriptionId}`);
    console.log(`Email: ${email}`);

    // Find the subscription
    const subscription = await Subscriber.findOne({
      where: {
        id: normalizedSubscriptionId,
        email: { [Op.iLike]: email },
        status: 'active' // Ensure status is active
      }
    });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    // Check if subscription is expired
    const endDate = new Date(subscription.endDate).getTime();
    const currentDate = new Date().getTime();

    console.log(`End Date: ${new Date(subscription.endDate)}`);
    console.log(`Current Date: ${new Date()}`);

    if (endDate < currentDate && subscription.status === 'active') {
      // Update status to inactive
      await subscription.update({ status: 'inactive' });

      console.log(`Subscription ${subscriptionId} marked as inactive`);

      // Check if this was the user's most recent active subscription
      const newerActiveSubscription = await Subscriber.findOne({
        where: {
          email: subscription.email,
          status: 'active',
          subscribedAt: {
            [Op.gt]: subscription.subscribedAt
          }
        }
      });

      // If no newer active subscription exists, revert the user's model
      if (!newerActiveSubscription) {
        const user = await User.findOne({ where: { email: subscription.email } });
        if (user) {
          const aiModel = getAIModelForSubscription('Freedom Sword');
          await user.update({ model: aiModel });

          console.log(`-------------- User Model Reverted --------------`);
          console.log(`User: ${user.email}
New Model: ${aiModel}
Reason: Subscription expired with no other active subscriptions
Updated at: ${new Date().toLocaleString()}`);
          console.log(`-----------------------------------------------------`);
        }
      }

      res.status(200).json({
        message: 'Subscription marked as inactive due to expiration',
        subscription
      });
    } else {
      res.status(200).json({
        message: 'Subscription is still active or already marked as inactive',
        subscription
      });
    }
  } catch (error: any) {
    console.error('Error expiring subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription status' });
  }
};

// Add a scheduled task function to check for expired subscriptions daily
export const checkForExpiredSubscriptions = async (): Promise<void> => {
  try {
    console.log('Running scheduled check for expired subscriptions...');
    const currentDate = new Date();

    // Find all expired subscriptions with status 'active' or 'cancelled'
    const expiredSubscriptions = await Subscriber.findAll({
      where: {
        status: {
          [Op.in]: ['active', 'cancelled']
        },
        endDate: {
          [Op.lt]: currentDate
        }
      }
    });

    console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);

    if (expiredSubscriptions.length === 0) {
      console.log('No expired subscriptions found.');
      return;
    }

    // Group subscriptions by email
    const subscriptionsByEmail: Record<string, Subscriber[]> = expiredSubscriptions.reduce((acc, subscription) => {
      if (!acc[subscription.email]) {
        acc[subscription.email] = [];
      }
      acc[subscription.email].push(subscription);
      return acc;
    }, {});

    // Update all expired subscriptions to 'inactive' in bulk
    const subscriptionIds = expiredSubscriptions.map(sub => sub.id);
    await Subscriber.update(
      { status: 'inactive' },
      { where: { id: subscriptionIds } }
    );
    console.log(`Updated ${subscriptionIds.length} subscriptions to 'inactive'`);

    // Revert user models if they have no other active or cancelled subscriptions
    for (const email of Object.keys(subscriptionsByEmail)) {
      const activeOrCancelledSubscriptions = await Subscriber.findOne({
        where: {
          email,
          status: {
            [Op.in]: ['active', 'cancelled']
          }
        }
      });

      if (!activeOrCancelledSubscriptions) {
        const user = await User.findOne({ where: { email } });
        if (user) {
          const aiModel = getAIModelForSubscription('Freedom Sword');
          await user.update({ model: aiModel });

          console.log(`Reverted user model for ${email} to ${aiModel}`);
        }
      }
    }

    console.log('Scheduled check for expired subscriptions completed successfully.');
  } catch (error) {
    console.error('Error in scheduled expired subscription check:', error);
  }
};

// Add this new function to clean up stale pending subscriptions
const cleanupStalePendingSubscriptions = async (email: string) => {
  try {
    // Find pending subscriptions older than 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const stalePendingSubscriptions = await Subscriber.findAll({
      where: {
        email,
        status: 'pending',
        subscribedAt: {
          [Op.lt]: oneDayAgo
        }
      }
    });

    if (stalePendingSubscriptions.length > 0) {
      console.log(`Found ${stalePendingSubscriptions.length} stale pending subscriptions for email: ${email}`);

      // Get IDs of stale pending subscriptions
      const stalePendingIds = stalePendingSubscriptions.map(sub => sub.id);

      // Delete them
      await Subscriber.destroy({
        where: {
          id: stalePendingIds
        }
      });

      console.log(`Deleted ${stalePendingIds.length} stale pending subscriptions for email: ${email}`);
    }
  } catch (error) {
    console.error('Error cleaning up stale pending subscriptions:', error);
  }
};

// Add this new endpoint to clean up pending subscriptions
export const cleanupPendingSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({ error: 'Email parameter is required' });
      return;
    }

    // Find all pending subscriptions for this user
    const pendingSubscriptions = await Subscriber.findAll({
      where: {
        email: { [Op.iLike]: email },
        status: 'pending'
      }
    });

    if (pendingSubscriptions.length === 0) {
      res.status(200).json({ message: 'No pending subscriptions found for this user' });
      return;
    }

    // Delete all pending subscriptions
    await Subscriber.destroy({
      where: {
        email: { [Op.iLike]: email },
        status: 'pending'
      }
    });

    res.status(200).json({
      message: `Successfully cleaned up ${pendingSubscriptions.length} pending subscriptions for user ${email}`
    });
  } catch (error) {
    console.error('Error cleaning up pending subscriptions:', error);
    res.status(500).json({ error: 'Failed to clean up pending subscriptions' });
  }
};