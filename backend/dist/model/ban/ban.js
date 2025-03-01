"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../service/database"));
const user_1 = __importDefault(require("../user/user"));
class Ban extends sequelize_1.Model {
}
Ban.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false }, // Add username field
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    banType: {
        type: sequelize_1.DataTypes.ENUM('permanent', 'temporary'),
        allowNull: false
    },
    endDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    comment: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: database_1.default,
    modelName: 'Ban',
    tableName: 'Bans',
    timestamps: true,
});
Ban.belongsTo(user_1.default, { foreignKey: 'userId' });
exports.default = Ban;
//# sourceMappingURL=ban.js.map