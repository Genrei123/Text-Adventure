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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGamesCount = exports.getMetrics = void 0;
const sequelize_1 = __importDefault(require("../config/sequelize"));
const getMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [emailVerified, activePlayers, offlinePlayers] = yield Promise.all([
            sequelize_1.default.query('SELECT COUNT(*) FROM users WHERE "emailVerified" = true', { type: sequelize_1.default.QueryTypes.SELECT }),
            sequelize_1.default.query(`SELECT COUNT(DISTINCT "UserId") FROM sessions 
        WHERE "endTime" IS NULL OR "endTime" > NOW() - INTERVAL '15 minutes'`, { type: sequelize_1.default.QueryTypes.SELECT }),
            sequelize_1.default.query(`SELECT COUNT(*) FROM users 
        WHERE id NOT IN (SELECT DISTINCT "UserId" FROM sessions 
        WHERE "endTime" IS NULL OR "endTime" > NOW() - INTERVAL '15 minutes')`, { type: sequelize_1.default.QueryTypes.SELECT })
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
});
exports.getMetrics = getMetrics;
const getGamesCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield sequelize_1.default.query('SELECT COUNT(*) FROM games', { type: sequelize_1.default.QueryTypes.SELECT });
        res.json({ count: Number(result[0].count) });
    }
    catch (error) {
        console.error('Error fetching games count:', error);
        res.status(500).json({ error: 'Error fetching games count' });
    }
});
exports.getGamesCount = getGamesCount;
//# sourceMappingURL=metrics.controller.js.map