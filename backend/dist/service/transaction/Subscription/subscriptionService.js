"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionPlan = void 0;
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
const createSubscriptionPlan = async (planData) => {
    try {
        const response = await axiosInstance.post('/recurring/plans', planData);
        return response.data;
    }
    catch (error) {
        if (error.response) {
            console.error('Error creating subscription plan:', error.response.data);
        }
        else {
            console.error('Error creating subscription plan:', error.message);
        }
        throw error;
    }
};
exports.createSubscriptionPlan = createSubscriptionPlan;
//# sourceMappingURL=subscriptionService.js.map