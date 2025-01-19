import { Request, Response } from 'express';
import axios from 'axios';
import { xenditHeaders } from '../service/xenditClient';

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const invoiceData = {
            external_id: req.body.external_id,
            payer_email: req.body.payer_email,
            description: req.body.description,
            amount: req.body.amount,
            currency: 'PHP', // Ensure the currency is set to PHP
            invoice_duration: req.body.invoice_duration
        };

        const response = await axios.post('https://api.xendit.co/v2/invoices', invoiceData, {
            headers: xenditHeaders
        });

        res.status(201).json(response.data);
    } catch (error: any) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request data:', error.request);
            res.status(500).json({ error: 'No response received from Xendit API' });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
};