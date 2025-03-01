"use strict";
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
async function getCoinBalance(userId) {
    const user = await user_1.default.findByPk(userId, {
        attributes: ['coins'],
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user.totalCoins;
}
// Deduct coins based on token count
async function deductCoinsByTokens(userId, text) {
    // Fetch the user
    const user = await user_1.default.findByPk(userId);
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
    await user.save();
}
async function checkOrderIdExists(order_id) {
    const order = await order_1.default.findOne({ where: { order_id } });
    return !!order; // Return true if order exists, false otherwise
}
//# sourceMappingURL=coinService.js.map