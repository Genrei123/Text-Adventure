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
exports.buyItem = exports.deductCoins = exports.getCoins = exports.getItemDetails = void 0;
const xenditClient_1 = require("../../service/transaction/xenditClient");
const user_1 = __importDefault(require("../../model/user/user")); // Import the User model
const ItemModel_1 = __importDefault(require("../../model/transaction/ItemModel")); // Import the Item model
const dotenv_1 = __importDefault(require("dotenv"));
const paymentMethodService_1 = require("../../service/transaction/Subscription/paymentMethodService");
const coinService_1 = require("../../service/transaction/Item Shop/coinService"); // Import coin service
const tokenizer_1 = require("../../utils/tokenizer"); // Import the correct function
dotenv_1.default.config();
// Constants for return URLs
const SUCCESS_RETURN_URL = 'https://example.com/payment-success';
const FAILURE_RETURN_URL = 'https://example.com/payment-failure';
// Function to generate a random 6-character alphanumeric string
const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
// Function to fetch item details based on item ID
const getItemDetails = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield ItemModel_1.default.findByPk(itemId);
    if (!item) {
        throw new Error('Item not found');
    }
    return item;
});
exports.getItemDetails = getItemDetails;
// Function to fetch user details from the database using email
const getUserDetailsByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
// Fetch coin balance
const getCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const user = yield user_1.default.findByPk(userId, {
            attributes: ['totalCoins'],
        });
        if (user) {
            res.json({ coins: user.totalCoins });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCoins = getCoins;
// Deduct coins based on text input
const deductCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, messages } = req.body;
    try {
        // Calculate the number of tokens using the tokenizer
        const tokenCount = (0, tokenizer_1.getChatTokenDetails)(messages);
        // Calculate the number of coins to deduct
        const coinsToDeduct = tokenCount; // Assuming 1 coin per token
        yield (0, coinService_1.deductCoinsByTokens)(userId, messages.map((msg) => msg.content).join(' '));
        res.status(200).json({
            message: 'Coins deducted successfully',
            coinsDeducted: coinsToDeduct,
            deductionDetails: `Deducted ${coinsToDeduct} coins for ${tokenCount} tokens (1 coin per token)`,
            tokens: messages
        });
        console.log(`Messages: ${JSON.stringify(messages)}`);
        console.log(`Coins deducted: ${coinsToDeduct} coins for ${tokenCount} tokens`);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deductCoins = deductCoins;
const buyItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { itemId, paymentMethod, email } = req.body;
    let item;
    let user;
    let orderId;
    try {
        // Fetch item details and user details from your database
        item = yield (0, exports.getItemDetails)(itemId);
        user = yield getUserDetailsByEmail(email);
        // Create an orderId with username, date, and a random 6-character alphanumeric string
        const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Format date as YYYYMMDD
        let randomId = generateRandomId();
        orderId = `order-${itemId}-${item.name}-${user.username}-${date}-${randomId}`;
        // Ensure the Order ID is unique
        while (yield (0, coinService_1.checkOrderIdExists)(orderId)) {
            randomId = generateRandomId();
            orderId = `order-${itemId}-${item.name}-${user.username}-${date}-${randomId}`;
        }
        // Create payment method data
        const paymentMethodData = {
            type: 'EWALLET',
            reusability: 'ONE_TIME_USE',
            ewallet: {
                channel_code: paymentMethod,
                channel_properties: {
                    success_return_url: SUCCESS_RETURN_URL,
                    failure_return_url: FAILURE_RETURN_URL,
                },
            },
            customer_id: user.id.toString(), // Convert customer_id to string
            metadata: {},
            context: 'buy_item', // Explicitly set context as 'buy_item'
        };
        // Create payment method
        const paymentMethodResponse = yield (0, paymentMethodService_1.createPaymentMethod)(paymentMethodData);
        // Create a payment request
        const data = {
            amount: item.price,
            paymentMethod: {
                ewallet: {
                    channelProperties: {
                        successReturnUrl: SUCCESS_RETURN_URL,
                        failureReturnUrl: FAILURE_RETURN_URL,
                    },
                    channelCode: paymentMethod, // 'GCASH' or 'MAYA'
                },
                reusability: 'ONE_TIME_USE',
                type: 'EWALLET',
            },
            currency: 'PHP',
            referenceId: orderId, // This is the field used by Xendit for tracking
        };
        const paymentRequest = yield xenditClient_1.PaymentRequest.createPaymentRequest({ data });
        const paymentLink = ((_b = (_a = paymentRequest.actions) === null || _a === void 0 ? void 0 : _a.find((action) => action.urlType === 'WEB')) === null || _b === void 0 ? void 0 : _b.url) || 'N/A';
        const formattedDate = new Date().toLocaleString();
        console.log(`-------------- Payment Request Details --------------`);
        console.log(`Status: Success
Item ID: ${itemId}
Item Name: ${item.name}
User ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Payment Method: ${paymentMethod}
Paid Amount: ${item.price}
Date Created: ${formattedDate}
Order ID: ${orderId}
Payment Request ID: ${paymentRequest.id}
Link To Payment: ${paymentLink}`);
        console.log(`-----------------------------------------------------`);
        console.log(` `);
        res.json({ paymentLink });
    }
    catch (error) {
        const formattedDate = new Date().toLocaleString();
        console.error(` ----------------- Payment Request Details -----------------`);
        console.error(`Status: Fail
Item ID: ${itemId}
Item Name: ${(item === null || item === void 0 ? void 0 : item.name) || 'N/A'}
User ID: ${(user === null || user === void 0 ? void 0 : user.id) || 'N/A'}
Username: ${(user === null || user === void 0 ? void 0 : user.username) || 'N/A'}
User Email: ${email}
Payment Method: ${paymentMethod}
Paid Amount: ${(item === null || item === void 0 ? void 0 : item.price) || 'N/A'}
Date Created: ${formattedDate}
Order ID: ${orderId}
Error: ${error.message}`);
        console.log(`-----------------------------------------------------`);
        console.log(` `);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        }
        else if (error.request) {
            res.status(500).json({ error: 'No response received from Xendit API' });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.buyItem = buyItem;
//# sourceMappingURL=shopController.js.map