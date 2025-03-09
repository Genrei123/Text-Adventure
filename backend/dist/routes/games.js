"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_1 = __importDefault(require("../model/game/game"));
const router = (0, express_1.Router)();
router.get('/recent', async (req, res) => {
    try {
        const recentGames = await game_1.default.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['title', 'description', 'createdAt']
        });
        res.json(recentGames.map(g => ({
            title: g.title,
            excerpt: g.description.substring(0, 100),
            created: g.createdAt.toISOString()
        })));
    }
    catch (error) {
        console.error('Recent games error:', error);
        res.status(500).json({ error: 'Failed to load recent games' });
    }
});
router.get('/all', async (req, res) => {
    try {
        const games = await game_1.default.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'description', 'createdAt']
        });
        const gamesCount = await game_1.default.count();
        res.json({
            games: games.map(g => ({
                id: g.id,
                title: g.title,
                description: g.description,
                created: g.createdAt.toISOString()
            })),
            count: gamesCount
        });
    }
    catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to load games' });
    }
});
exports.default = router;
//# sourceMappingURL=games.js.map