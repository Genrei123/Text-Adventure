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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shopWebhookController_1 = require("../../controllers/transaction/shopWebhookController"); // Import the handlePaymentCallback function
const router = express_1.default.Router();
router.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body;
    console.log('Received webhook event:', event);
    try {
        switch (event.type) {
            case 'recurring.plan.activated':
                // Handle plan activation
                console.log('Plan activated:', event.data);
                // Update your database to mark the plan as activated
                break;
            case 'recurring.cycle.succeeded':
                // Handle successful payment cycle
                console.log('Payment cycle succeeded:', event.data);
                // Update your database to mark the payment as successful
                break;
            case 'recurring.cycle.retrying':
                // Handle payment retry
                console.log('Payment cycle retrying:', event.data);
                // Update your database to mark the payment as retrying
                break;
            case 'recurring.cycle.failed':
                // Handle failed payment cycle
                console.log('Payment cycle failed:', event.data);
                // Update your database to mark the payment as failed and terminate the service if necessary
                break;
            case 'payment_request.paid':
                // Handle payment success for buyItem
                console.log('Payment request paid:', event.data);
                yield (0, shopWebhookController_1.handlePaymentCallback)(req, res);
                return; // Return to avoid sending another response
            default:
                console.log('Unhandled event type:', event.type);
        }
        res.status(200).send('Event received');
    }
    catch (error) {
        console.error('Error processing webhook event:', error);
        res.status(500).send('Internal Server Error');
    }
}));
exports.default = router;
//# sourceMappingURL=webhookRoutes.js.map