"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_1 = __importDefault(require("../model/game/game")); // Corrected import syntax
const router = (0, express_1.Router)();
router.get('/recent', async (req, res) => {
    try {
        const recentGames = await game_1.default.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['title', 'description', 'createdAt', 'status']
        });
        res.json(recentGames.map(g => ({
            title: g.title,
            excerpt: g.description.substring(0, 100),
            created: g.createdAt.toISOString(),
            status: g.status || 'draft'
        })));
    }
    catch (error) {
        console.error('Recent games error:', error);
        res.status(500).json({ error: 'Failed to load recent games' });
    }
});
exports.default = router;
//# sourceMappingURL=games.js.map