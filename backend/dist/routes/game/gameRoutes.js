"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../../controllers/game/game-creation/gameController");
const router = express_1.default.Router();
router.get('/', gameController_1.getAllGames);
router.get('/:id', gameController_1.getGameById);
router.post('/add-game', gameController_1.createGame);
router.get('/:id/comments', gameController_1.getComments);
router.get('/:id/ratings', gameController_1.getRatings);
router.post('/:id/comments', gameController_1.addComment);
router.post('/:id/ratings', gameController_1.addRating);
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map