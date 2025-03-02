"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ban = exports.Chat = exports.Item = exports.Order = exports.Rating = exports.Comment = exports.Game = exports.User = exports.initializeModels = void 0;
const user_1 = __importDefault(require("../model/user/user"));
exports.User = user_1.default;
const game_1 = __importDefault(require("../model/game/game"));
exports.Game = game_1.default;
const comments_1 = __importDefault(require("../model/game/comments"));
exports.Comment = comments_1.default;
const rating_1 = __importDefault(require("../model/game/rating"));
exports.Rating = rating_1.default;
const order_1 = __importDefault(require("../model/transaction/order"));
exports.Order = order_1.default;
const ItemModel_1 = __importDefault(require("../model/transaction/ItemModel")); // Adjust path if needed
exports.Item = ItemModel_1.default;
const chat_1 = __importDefault(require("../model/chat/chat"));
exports.Chat = chat_1.default;
const ban_1 = __importDefault(require("../model/ban/ban"));
exports.Ban = ban_1.default;
const associations_1 = __importDefault(require("../model/associations"));
const initializeModels = async () => {
    try {
        // First create tables without foreign keys
        await user_1.default.sync({ alter: true });
        await game_1.default.sync({ alter: true });
        // Then sync dependent models
        await comments_1.default.sync({ alter: true });
        await rating_1.default.sync({ alter: true });
        await order_1.default.sync({ alter: true });
        await ItemModel_1.default.sync({ alter: true });
        await chat_1.default.sync({ alter: true });
        await ban_1.default.sync({ alter: true });
        // Define associations
        (0, associations_1.default)();
        console.log("Database tables synchronized successfully.");
    }
    catch (error) {
        console.error("Error synchronizing database:", error);
        throw error;
    }
};
exports.initializeModels = initializeModels;
//# sourceMappingURL=models.js.map