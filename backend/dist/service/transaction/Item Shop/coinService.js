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
exports.getCoinBalance = getCoinBalance;
exports.deductCoinsByTokens = deductCoinsByTokens;
exports.checkOrderIdExists = checkOrderIdExists;
const user_1 = __importDefault(require("../../../model/user/user"));
const tokenizer_1 = require("../../../utils/tokenizer");
const order_1 = __importDefault(require("../../../model/transaction/order")); // Import the Order model
// Fetch user's coin balance
function getCoinBalance(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findByPk(userId, {
            attributes: ['coins'],
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user.totalCoins;
    });
}
// Deduct coins based on token count
function deductCoinsByTokens(userId, text) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the user
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Calculate the token count and get tokens
        let tokenCount;
        try {
            // Assuming the text is a single message
            const messages = [{ role: "user", content: text }];
            tokenCount = (0, tokenizer_1.getChatTokenDetails)(messages);
        }
        catch (error) {
            console.error('Error getting token details:', error);
            throw new Error('Failed to get token details');
        }
        const coinsToDeduct = tokenCount; // Assuming 1 coin per token
        if (user.totalCoins < coinsToDeduct) {
            throw new Error('Insufficient coins');
        }
        // Deduct coins
        user.totalCoins -= coinsToDeduct;
        yield user.save();
    });
}
function checkOrderIdExists(order_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = yield order_1.default.findOne({ where: { order_id } });
        return !!order; // Return true if order exists, false otherwise
    });
}
//# sourceMappingURL=coinService.js.map