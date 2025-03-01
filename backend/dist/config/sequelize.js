"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/sequelize.ts
const sequelize_1 = require("sequelize");
require("dotenv/config");
const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
    throw new Error('DATABASE_URI is not defined in environment variables');
}
const sequelize = new sequelize_1.Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    }
});
exports.default = sequelize;
//# sourceMappingURL=sequelize.js.map