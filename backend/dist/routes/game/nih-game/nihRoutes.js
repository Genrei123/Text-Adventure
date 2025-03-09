"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nihController_1 = require("../../../controllers/game/game-creation/nih-game/nihController");
const router = express_1.default.Router();
router.post('/game/:gameId/player/:playerId/change-location', nihController_1.changeLocation);
router.post('/game/:gameId/player/:playerId/use-item', nihController_1.useItem);
router.get('/game/:gameId/player/:playerId/inventory', nihController_1.getInventory);
router.get('/game/:gameId/player/:playerId/state', nihController_1.getGameState); // Add this route
exports.default = router;
//# sourceMappingURL=nihRoutes.js.map