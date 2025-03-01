"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../../config/sequelize"));
class User extends sequelize_1.Model {
}
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    private: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    model: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'gpt-4' },
    admin: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    emailVerified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    resetPasswordToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    totalCoins: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    verificationToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    verificationTokenExpires: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: sequelize_2.default,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
});
exports.default = User;
//# sourceMappingURL=user.js.map