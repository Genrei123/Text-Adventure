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
exports.getPlayers = void 0;
const database_1 = __importDefault(require("../service/database"));
const getPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield database_1.default.query(query, { type: database_1.default.QueryTypes.SELECT });
        const total = yield database_1.default.query('SELECT COUNT(*) FROM users', { type: database_1.default.QueryTypes.SELECT });
        res.json({ items: result, total: parseInt(total[0].count) });
    }
    catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Error fetching players' });
    }
});
exports.getPlayers = getPlayers;
//# sourceMappingURL=players.controller.js.map