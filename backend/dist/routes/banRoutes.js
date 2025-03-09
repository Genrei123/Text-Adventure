"use strict";
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
router.post('/', async (req, res) => {
    try {
        const ban = await (0, banService_1.createBan)(req.body);
        res.status(201).json(ban);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating ban', error });
    }
});
/**
 * Route to update a ban with a comment.
 * @route PUT /api/bans/:id
 * @access Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        await (0, banService_1.updateBan)(Number(id), comment);
        res.status(200).json({ message: 'Ban updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating ban', error });
    }
});
/**
 * Route to fetch all bans.
 * @route GET /api/bans
 * @access Admin
 */
router.get('/', async (req, res) => {
    try {
        const bans = await (0, banService_1.getAllBans)();
        res.status(200).json(bans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bans', error });
    }
});
/**
 * Route to fetch temporary bans.
 * @route GET /api/bans/temporary
 * @access Admin
 */
router.get('/temporary', async (req, res) => {
    try {
        const bans = await (0, banService_1.getTemporaryBans)();
        res.status(200).json(bans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching temporary bans', error });
    }
});
/**
 * Route to fetch permanent bans.
 * @route GET /api/bans/permanent
 * @access Admin
 */
router.get('/permanent', async (req, res) => {
    try {
        const bans = await (0, banService_1.getPermanentBans)();
        res.status(200).json(bans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching permanent bans', error });
    }
});
/**
 * Route to delete a ban by ID.
 * @route DELETE /api/bans/:id
 * @access Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await (0, banService_1.deleteBan)(Number(id));
        res.status(200).json({ message: 'Ban deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting ban', error });
    }
});
/**
 * Route to search users by username.
 * @route GET /api/bans/users/search
 * @access Admin
 */
router.get('/users/search', async (req, res) => {
    try {
        const { term } = req.query;
        const users = await (0, banService_1.searchUsers)(term);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error searching users', error });
    }
});
exports.default = router;
//# sourceMappingURL=banRoutes.js.map