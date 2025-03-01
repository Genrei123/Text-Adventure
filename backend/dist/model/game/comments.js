"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../service/database"));
class Comment extends sequelize_1.Model {
}
Comment.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    UserId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    GameId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "Comment",
    tableName: "Comments",
});
exports.default = Comment;
//# sourceMappingURL=comments.js.map