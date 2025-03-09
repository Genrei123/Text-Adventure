"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentMethod = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretApiKey = process.env.XENDIT_SECRET_KEY;
const xenditBaseURL = 'https://api.xendit.co';
const axiosInstance = axios_1.default.create({
    baseURL: xenditBaseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(secretApiKey + ':').toString('base64')}`
    }
});
const createPaymentMethod = async (data) => {
    try {
        const response = await axiosInstance.post('/v2/payment_methods', data);
        return response.data;
    }
    catch (error) {
        console.error('Error creating payment method:', error);
        throw error;
    }
};
exports.createPaymentMethod = createPaymentMethod;
//# sourceMappingURL=paymentMethodService.js.map