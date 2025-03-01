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
exports.getBans = exports.createBan = void 0;
const ban_1 = __importDefault(require("../model/ban/ban"));
const user_1 = __importDefault(require("../model/user/user"));
/**
 * Controller to create a new ban.
 * @param req - The request object.
 * @param res - The response object.
 */
const createBan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ban = yield ban_1.default.create(req.body);
        console.log(`[BanController] Created ban ID ${ban.id}`);
        res.status(201).json(ban);
    }
    catch (error) {
        console.error('[BanController] Create error:', error);
        const err = error;
        res.status(400).json({
            error: 'Invalid ban data',
            details: (_a = err.errors) === null || _a === void 0 ? void 0 : _a.map(e => e.message)
        });
    }
});
exports.createBan = createBan;
/**
 * Controller to fetch all bans.
 * @param req - The request object.
 * @param res - The response object.
 */
const getBans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bans = yield ban_1.default.findAll({
            include: [{ model: user_1.default, attributes: ['username'] }]
        });
        console.log(`[BanController] Fetched ${bans.length} bans`);
        res.json(bans);
    }
    catch (error) {
        console.error('[BanController] Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bans' });
    }
});
exports.getBans = getBans;
//# sourceMappingURL=banController.js.map