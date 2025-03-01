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
exports.createSubscriptionPlan = exports.stopRecurringPayment = exports.updateRecurringPayment = exports.createRecurringPayment = void 0;
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
const createRecurringPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axiosInstance.post('/recurring/plans', data);
        return response.data;
    }
    catch (error) {
        console.error('Error creating recurring payment:', error);
        throw error;
    }
});
exports.createRecurringPayment = createRecurringPayment;
const updateRecurringPayment = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axiosInstance.patch(`/recurring/plans/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.error('Error updating recurring payment:', error);
        throw error;
    }
});
exports.updateRecurringPayment = updateRecurringPayment;
const stopRecurringPayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axiosInstance.post(`/recurring/plans/${id}/stop`);
        return response.data;
    }
    catch (error) {
        console.error('Error stopping recurring payment:', error);
        throw error;
    }
});
exports.stopRecurringPayment = stopRecurringPayment;
const createSubscriptionPlan = (planData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axiosInstance.post('/recurring/plans', planData);
        return response.data;
    }
    catch (error) {
        console.error('Error creating subscription plan:', error);
        throw error;
    }
});
exports.createSubscriptionPlan = createSubscriptionPlan;
//# sourceMappingURL=recurringPaymentService.js.map