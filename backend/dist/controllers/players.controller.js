"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayers = void 0;
const sequelize_1 = __importDefault(require("../config/sequelize"));
const sequelize_2 = require("sequelize");
const getPlayers = async (req, res) => {
    const { search, status, subscription, sortBy, sortOrder, page, limit } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let query = 'SELECT * FROM users WHERE 1=1';
    if (search)
        query += ` AND username ILIKE '%${search}%'`;
    if (status && status !== 'all')
        query += ` AND status = '${status}'`;
    if (subscription && subscription !== 'all')
        query += ` AND subscription = '${subscription}'`;
    query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`;
    try {
        const result = await sequelize_1.default.query(query, { type: sequelize_2.QueryTypes.SELECT });
        const total = await sequelize_1.default.query('SELECT COUNT(*) FROM users', { type: sequelize_2.QueryTypes.SELECT });
        res.json({ items: result, total: parseInt(total[0].count) });
    }
    catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Error fetching players' });
    }
};
exports.getPlayers = getPlayers;
//# sourceMappingURL=players.controller.js.map