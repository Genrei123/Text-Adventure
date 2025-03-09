"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = exports.PaymentRequest = void 0;
const xendit_node_1 = __importDefault(require("xendit-node"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretApiKey = process.env.XENDIT_SECRET_KEY;
const xenditClient = new xendit_node_1.default({
    secretKey: secretApiKey,
    //xenditURL: 'https://api.xendit.co' // Custom base URL
});
exports.PaymentRequest = xenditClient.PaymentRequest, exports.Invoice = xenditClient.Invoice;
//# sourceMappingURL=xenditClient.js.map