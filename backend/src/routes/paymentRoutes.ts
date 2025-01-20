import express from 'express';
import { buyItem } from '../controllers/paymentController';

const router = express.Router();

router.post('/buy-item', buyItem);

export default router;