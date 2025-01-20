import { Request, Response } from 'express';
import { Invoice } from '../service/xenditClient';

// Utility function to log errors
const logError = (error: any) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request data:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
    }
};

export const createInvoice = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { external_id, payer_email, description, amount, invoice_duration } = req.body;
        if (!external_id || !payer_email || !description || !amount || !invoice_duration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const invoiceData = {
            externalId: external_id,
            payerEmail: payer_email,
            description: description,
            amount: amount,
            currency: 'PHP', // Ensure the currency is set to PHP
            invoiceDuration: invoice_duration
        };

        const response = await Invoice.createInvoice({ data: invoiceData });

        res.status(201).json(response);
    } catch (error: any) {
        logError(error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            res.status(500).json({ error: 'No response received from Xendit API' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};