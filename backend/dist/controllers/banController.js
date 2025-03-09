"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBans = exports.createBan = void 0;
const ban_1 = __importDefault(require("../model/ban/ban"));
const user_1 = __importDefault(require("../model/user/user"));
/**
 * Controller to create a new ban.
 * @param req - The request object.
 * @param res - The response object.
 */
const createBan = async (req, res) => {
    try {
        const ban = await ban_1.default.create(req.body);
        console.log(`[BanController] Created ban ID ${ban.id}`);
        res.status(201).json(ban);
    }
    catch (error) {
        console.error('[BanController] Create error:', error);
        const err = error;
        res.status(400).json({
            error: 'Invalid ban data',
            details: err.errors?.map(e => e.message)
        });
    }
};
exports.createBan = createBan;
/**
 * Controller to fetch all bans.
 * @param req - The request object.
 * @param res - The response object.
 */
const getBans = async (req, res) => {
    try {
        const bans = await ban_1.default.findAll({
            include: [{ model: user_1.default, attributes: ['username'] }]
        });
        console.log(`[BanController] Fetched ${bans.length} bans`);
        res.json(bans);
    }
    catch (error) {
        console.error('[BanController] Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bans' });
    }
};
exports.getBans = getBans;
//# sourceMappingURL=banController.js.map