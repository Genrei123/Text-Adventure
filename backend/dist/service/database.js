"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
require("dotenv/config");
const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
    throw new Error("DATABASE_URI is not defined in environment variables");
}
const sequelize = new sequelize_1.Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});
exports.sequelize = sequelize;
exports.default = sequelize;
//# sourceMappingURL=database.js.map