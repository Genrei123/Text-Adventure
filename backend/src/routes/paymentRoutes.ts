import { Router } from 'express';
import { createInvoice } from '../controllers/paymentController';

const router = Router();

router.post('/create-invoice', createInvoice);

export default router;