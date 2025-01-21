import { Request, Response } from 'express';
import { Invoice } from '../service/xenditClient';

// Utility function to log errors
const logError = (error: any) => {
    if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
        console.error('Error request data:', error.request);
    } else {
        console.error('Error message:', error.message);
    }
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request received:', req.body);

        // Validate request body
        const { external_id, payer_email, description, amount, invoice_duration } = req.body;
        if (!external_id || !payer_email || !description || !amount || !invoice_duration) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const invoiceData = {
            externalId: external_id,
            payerEmail: payer_email,
            description: description,
            amount: amount,
            currency: 'PHP',
            invoiceDuration: invoice_duration
        };

        console.log('Invoice data:', invoiceData);

        const response = await Invoice.createInvoice({ data: invoiceData });

        console.log('Invoice created successfully:', response);

        res.status(201).json(response);
    } catch (error: any) {
        logError(error);
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else if (error.request) {
            res.status(500).json({ error: 'No response received from Xendit API' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};