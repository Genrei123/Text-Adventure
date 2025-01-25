import { Request, Response } from 'express';
import { createCustomer } from '../../service/customerService';

export const createCustomerController = async (req: Request, res: Response) => {
  const { reference_id, given_names, surname, email, mobile_number } = req.body;

  if (!reference_id) {
    return res.status(400).json({ message: '"reference_id" is required' });
  }

  try {
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

    return res.status(201).json(customer);
  } catch (error: any) {
    console.error('Error creating customer:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};