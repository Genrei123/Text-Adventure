"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGamesCount = exports.getMetrics = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const getMetrics = async (req, res) => {
    try {
        const [emailVerified, gamesResult] = await Promise.all([
            sequelize_2.default.query('SELECT COUNT(*) FROM "Users" WHERE "emailVerified" = true', { type: sequelize_1.QueryTypes.SELECT }),
            sequelize_2.default.query('SELECT COUNT(*) FROM "Games"', { type: sequelize_1.QueryTypes.SELECT })
        ]);
        res.json({
            emailVerifiedCount: Number(emailVerified[0].count),
            activePlayersCount: 45, // Mock data
            offlinePlayersCount: 155, // Mock data
            gamesCount: Number(gamesResult[0].count)
        });
    }
    catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Error fetching metrics' });
    }
};
exports.getMetrics = getMetrics;
const getGamesCount = async (req, res) => {
    try {
        const result = await sequelize_2.default.query('SELECT COUNT(*) FROM "Games"', { type: sequelize_1.QueryTypes.SELECT });
        res.json({ count: Number(result[0].count) });
    }
    catch (error) {
        console.error('Error fetching games count:', error);
        res.status(500).json({ error: 'Error fetching games count' });
    }
};
exports.getGamesCount = getGamesCount;
//# sourceMappingURL=metrics.controller.js.map