"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = void 0;
const xenditClient_1 = require("../../service/transaction/xenditClient");
// Utility function to log errors
const logError = (error) => {
    if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
    }
    else if (error.request) {
        console.error('Error request data:', error.request);
    }
    else {
        console.error('Error message:', error.message);
    }
};
// Create an invoice
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield xenditClient_1.Invoice.createInvoice({ data: invoiceData });
        console.log('Invoice created successfully:', response);
        res.status(201).json(response);
    }
    catch (error) {
        logError(error);
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        }
        else if (error.request) {
            res.status(500).json({ error: 'No response received from Xendit API' });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.createInvoice = createInvoice;
//# sourceMappingURL=invoiceController.js.map