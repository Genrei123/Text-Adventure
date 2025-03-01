"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerService_1 = require("../../service/transaction/Subscription/customerService");
const paymentMethodService_1 = require("../../service/transaction/Subscription/paymentMethodService");
const subscriptionService_1 = require("../../service/transaction/Subscription/subscriptionService");
const shopController_1 = require("../../controllers/transaction/shopController");
const shopWebhookController_1 = require("../../controllers/transaction/shopWebhookController"); // Correct import path
const router = express_1.default.Router();
// ============================== Subscription Routes ==============================
// Route for creating a customer
router.post('/create-customer', async (req, res) => {
    try {
        const customerData = req.body.customerData;
        const customer = await (0, customerService_1.createCustomer)(customerData);
        console.log('Customer created:', customer);
        res.status(201).json(customer);
    }
    catch (error) {
        console.error('Error creating customer:', error.message);
        res.status(400).json({ error: error.message });
    }
});
// Route for creating a payment method
router.post('/create-payment-method', async (req, res) => {
    try {
        const paymentMethodData = req.body.paymentMethodData;
        const paymentMethod = await (0, paymentMethodService_1.createPaymentMethod)(paymentMethodData);
        console.log('Payment method created:', paymentMethod);
        res.status(201).json(paymentMethod);
        // If the payment method requires action, provide the URL to the user
        if (paymentMethod.status === 'REQUIRES_ACTION') {
            res.status(201).json({
                message: 'Payment method requires action',
                action_url: paymentMethod.actions[0].url
            });
        }
        else {
            res.status(201).json(paymentMethod);
        }
    }
    catch (error) {
        console.error('Error creating payment method:', error.message);
        res.status(400).json({ error: error.message });
    }
});
// Route for creating a subscription plan
router.post('/create-subscription-plan', async (req, res) => {
    try {
        const planData = req.body.planData;
        const plan = await (0, subscriptionService_1.createSubscriptionPlan)(planData);
        console.log('Subscription plan created:', plan);
        res.status(201).json(plan);
    }
    catch (error) {
        console.error('Error creating subscription plan:', error.message);
        res.status(400).json({ error: error.message });
    }
});
// ============================== Shop Item Routes ==============================
// Route for buying an item on shop
router.post('/buy-item', shopController_1.buyItem);
router.post('/payment', shopWebhookController_1.handlePaymentCallback);
exports.default = router;
//# sourceMappingURL=shopRoutes.js.map