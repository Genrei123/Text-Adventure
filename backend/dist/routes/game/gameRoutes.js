"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../../controllers/game/game-creation/gameController");
const router = (0, express_1.Router)();
router.get('/all', gameController_1.getAllGames);
router.get('/:id', async (req, res) => {
    try {
        await (0, gameController_1.getGameById)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get game by ID' });
    }
});
router.post('/add-game', gameController_1.createGame);
router.get('/:id/comments', gameController_1.getComments);
router.get('/:id/ratings', gameController_1.getRatings);
router.post('/:id/comments', gameController_1.addComment);
router.post('/:id/ratings', gameController_1.addRating);
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map