"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../service/database"));
class Chat extends sequelize_1.Model {
}
Chat.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    parent_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    session_id: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    model: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    GameId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    UserId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true }, // Change allowNull to true
    image_prompt_name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    image_prompt_text: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    image_url: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
}, {
    sequelize: database_1.default,
    modelName: "Chat",
});
exports.default = Chat;
//# sourceMappingURL=chat.js.map