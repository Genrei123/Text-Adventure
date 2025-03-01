"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGamesCount = exports.getMetrics = void 0;
const sequelize_1 = __importDefault(require("../config/sequelize"));
const sequelize_2 = require("sequelize");
const getMetrics = async (req, res) => {
    try {
        const [emailVerified, activePlayers, offlinePlayers] = await Promise.all([
            sequelize_1.default.query('SELECT COUNT(*) FROM users WHERE "emailVerified" = true', { type: sequelize_2.QueryTypes.SELECT }),
            sequelize_1.default.query(`SELECT COUNT(DISTINCT "UserId") FROM sessions 
        WHERE "endTime" IS NULL OR "endTime" > NOW() - INTERVAL '15 minutes'`, { type: sequelize_2.QueryTypes.SELECT }),
            sequelize_1.default.query(`SELECT COUNT(*) FROM users 
        WHERE id NOT IN (SELECT DISTINCT "UserId" FROM sessions 
        WHERE "endTime" IS NULL OR "endTime" > NOW() - INTERVAL '15 minutes')`, { type: sequelize_2.QueryTypes.SELECT })
        ]);
        res.json({
            emailVerifiedCount: Number(emailVerified[0].count),
            activePlayersCount: Number(activePlayers[0].count),
            offlinePlayersCount: Number(offlinePlayers[0].count)
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
        const result = await sequelize_1.default.query('SELECT COUNT(*) FROM games', { type: sequelize_2.QueryTypes.SELECT });
        res.json({ count: Number(result[0].count) });
    }
    catch (error) {
        console.error('Error fetching games count:', error);
        res.status(500).json({ error: 'Error fetching games count' });
    }
};
exports.getGamesCount = getGamesCount;
//# sourceMappingURL=metrics.controller.js.map