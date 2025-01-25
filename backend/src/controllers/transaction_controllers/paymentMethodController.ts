import { Request, Response } from 'express';
import { createPaymentMethod } from '../../service/paymentMethodService';

export const createPaymentMethodController = async (req: Request, res: Response) => {
  const { channel_code, success_return_url, failure_return_url, customer_id } = req.body;

  if (!customer_id) {
    return res.status(400).json({ message: '"customer_id" is required' });
  }

  try {
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
      customer_id,
      metadata: { sku: 'ABCDEFGH' }
    });

    return res.status(201).json(paymentMethod);
  } catch (error: any) {
    console.error('Error creating payment method:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};