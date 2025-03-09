"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../service/database"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    client_reference_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    order_details: { type: sequelize_1.DataTypes.JSON, allowNull: false },
    paid_amount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true, // Changed to true temporarily
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    received_coins: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
}, {
    sequelize: database_1.default,
    modelName: "Orders",
});
exports.default = Order;
//# sourceMappingURL=order.js.map