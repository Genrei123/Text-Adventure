import { Router, Request, Response } from 'express';
import { createInvoice } from '../../controllers/transaction/invoiceController';

const router = Router();

router.post('/create-invoice', async (req: Request, res: Response) => {
  try {
    await createInvoice(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;