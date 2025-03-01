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
const express_1 = __importDefault(require("express"));
const banService_1 = require("../service/banService");
const router = express_1.default.Router();
/**
 * Route to create a new ban.
 * @route POST /api/bans
 * @access Admin
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ban = yield (0, banService_1.createBan)(req.body);
        res.status(201).json(ban);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating ban', error });
    }
}));
/**
 * Route to update a ban with a comment.
 * @route PUT /api/bans/:id
 * @access Admin
 */
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        yield (0, banService_1.updateBan)(Number(id), comment);
        res.status(200).json({ message: 'Ban updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating ban', error });
    }
}));
/**
 * Route to fetch all bans.
 * @route GET /api/bans
 * @access Admin
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bans = yield (0, banService_1.getAllBans)();
        res.status(200).json(bans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bans', error });
    }
}));
/**
 * Route to fetch temporary bans.
 * @route GET /api/bans/temporary
 * @access Admin
 */
router.get('/temporary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bans = yield (0, banService_1.getTemporaryBans)();
        res.status(200).json(bans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching temporary bans', error });
    }
}));
/**
 * Route to fetch permanent bans.
 * @route GET /api/bans/permanent
 * @access Admin
 */
router.get('/permanent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bans = yield (0, banService_1.getPermanentBans)();
        res.status(200).json(bans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching permanent bans', error });
    }
}));
/**
 * Route to delete a ban by ID.
 * @route DELETE /api/bans/:id
 * @access Admin
 */
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, banService_1.deleteBan)(Number(id));
        res.status(200).json({ message: 'Ban deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting ban', error });
    }
}));
/**
 * Route to search users by username.
 * @route GET /api/bans/users/search
 * @access Admin
 */
router.get('/users/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { term } = req.query;
        const users = yield (0, banService_1.searchUsers)(term);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error searching users', error });
    }
}));
exports.default = router;
//# sourceMappingURL=banRoutes.js.map