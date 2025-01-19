import { Request, Response } from 'express';
import x from '../service/xenditClient';
const { Invoice } = require('xendit-node');

const invoice = new Invoice(x);

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { externalID, payerEmail } = req.body;
    const amount = 50; // 50 pesos for 500 coins
    const description = 'Purchase of 500 coins';

    const response = await invoice.createInvoice({
      externalID,
      amount,
      payerEmail,
      description,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};