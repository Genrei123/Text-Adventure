"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user/user"));
const game_1 = __importDefault(require("./game/game"));
const comments_1 = __importDefault(require("./game/comments"));
const rating_1 = __importDefault(require("./game/rating"));
const order_1 = __importDefault(require("./transaction/order")); // Adjust path
const chat_1 = __importDefault(require("./chat/chat")); // Adjust path
const defineAssociations = () => {
    // User <-> Game
    user_1.default.hasMany(game_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    game_1.default.belongsTo(user_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // User <-> Comment
    user_1.default.hasMany(comments_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    comments_1.default.belongsTo(user_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // Game <-> Comment
    game_1.default.hasMany(comments_1.default, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    comments_1.default.belongsTo(game_1.default, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // User <-> Rating
    user_1.default.hasMany(rating_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    rating_1.default.belongsTo(user_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // Game <-> Rating
    game_1.default.hasMany(rating_1.default, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    rating_1.default.belongsTo(game_1.default, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // User <-> Order
    user_1.default.hasMany(order_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    order_1.default.belongsTo(user_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // User <-> Chat
    user_1.default.hasMany(chat_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    chat_1.default.belongsTo(user_1.default, { foreignKey: "UserId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    // Game <-> Chat
    game_1.default.hasMany(chat_1.default, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    chat_1.default.belongsTo(game_1.default, { foreignKey: "GameId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
};
exports.default = defineAssociations;
//# sourceMappingURL=associations.js.map