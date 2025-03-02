"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../../config/sequelize")); // Adjusted path
class Game extends sequelize_1.Model {
}
Game.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    slug: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    tagline: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    genre: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    subgenre: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    primary_color: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    prompt_name: { type: sequelize_1.DataTypes.STRING, defaultValue: "UGC", allowNull: false },
    prompt_text: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    prompt_model: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "gpt-3.5-turbo" },
    image_prompt_model: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    image_prompt_name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    image_prompt_text: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    image_data: { type: sequelize_1.DataTypes.BLOB, allowNull: true },
    music_prompt_text: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    music_prompt_seed_image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    private: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: "draft" }, // Added status property
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW, field: 'createdAt' },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW, field: 'updatedAt' },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true, // Matches database NULLABLE
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    sequelize: sequelize_2.default,
    modelName: "Game",
    tableName: 'games'
});
exports.default = Game;
//# sourceMappingURL=game.js.map