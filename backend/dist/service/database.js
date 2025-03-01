"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("dotenv").config();
const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
    throw new Error("DATABASE_URI is not defined in the environment variables");
}
const sequelize = new sequelize_1.Sequelize(DATABASE_URI, {
    dialect: 'postgres',
    protocol: 'postgres',
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
const query = (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, params = []) {
    try {
        const [results] = yield sequelize.query(sql, {
            replacements: params,
            type: sequelize.QueryTypes.SELECT
        });
        return results;
    }
    catch (error) {
        throw new Error(`Database query error: ${error}`);
    }
});
exports.query = query;
exports.default = sequelize;
//# sourceMappingURL=database.js.map