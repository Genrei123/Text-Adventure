import { Request, Response } from 'express';
import { createCustomer } from '../../service/customerService';
import { createPaymentMethod } from '../../service/paymentMethodService';
import { createRecurringPayment, updateRecurringPayment, stopRecurringPayment } from '../../service/recurringPaymentService';

export const createSubscriptionPlan = async (req: Request, res: Response) => {
  const { reference_id, given_names, surname, email, mobile_number, channel_code, currency, amount, schedule, immediate_action_type, notification_config, failed_cycle_action, metadata, description, items, success_return_url, failure_return_url } = req.body;

  try {
    // Step 1: Create Customer
    const customer = await createCustomer({
      reference_id,
      type: 'INDIVIDUAL',
      individual_detail: {
        given_names,
        surname
      },
      email,
      mobile_number
    });

    // Step 2: Create Payment Method
    const paymentMethod = await createPaymentMethod({
      type: 'EWALLET',
      reusability: 'MULTIPLE_USE',
      ewallet: {
        channel_code,
        channel_properties: {
          success_return_url,
          failure_return_url
        }
      },
      customer_id: customer.id,
      metadata: { sku: 'ABCDEFGH' }
    });

    // Step 3: Create Subscription Plan
    const plan = await createRecurringPayment({
      reference_id,
      customer_id: customer.id,
      recurring_action: 'PAYMENT',
      currency,
      amount,
      payment_methods: [{ payment_method_id: paymentMethod.id, rank: 1 }],
      schedule: {
        ...schedule,
        reference_id
      },
      immediate_action_type,
      notification_config,
      failed_cycle_action,
      metadata,
      description,
      items,
      success_return_url,
      failure_return_url
    });

    res.status(201).json(plan);
  } catch (error: any) {
    console.error('Error creating subscription plan:', error.response?.data || error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reference_id, customer_id, recurring_action, currency, amount, schedule, immediate_action_type, notification_config, failed_cycle_action, metadata, description, items, success_return_url, failure_return_url } = req.body;

  try {
    const plan = await updateRecurringPayment(id, {
      reference_id,
      customer_id,
      recurring_action,
      currency,
      amount,
      schedule,
      immediate_action_type,
      notification_config,
      failed_cycle_action,
      metadata,
      description,
      items,
      success_return_url,
      failure_return_url
    });

    res.status(200).json(plan);
  } catch (error: any) {
    console.error('Error updating subscription plan:', error.response?.data || error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const stopSubscriptionPlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await stopRecurringPayment(id);
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error stopping subscription plan:', error.response?.data || error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleSubscriptionWebhook = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  try {
    switch (event) {
      case 'invoice.paid':
        // Handle invoice paid event
        console.log('Invoice paid:', data);
        break;
      case 'subscription.activated':
        // Handle subscription activated event
        console.log('Subscription activated:', data);
        break;
      case 'subscription.canceled':
        // Handle subscription canceled event
        console.log('Subscription canceled:', data);
        break;
      default:
        console.log('Unhandled event:', event);
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error: any) {
    console.error('Error handling webhook:', error.response?.data || error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};