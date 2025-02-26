import express from 'express';
import { 
  changeLocation, 
  useItem, 
  getInventory,
  getGameState // Add this import
} from "../../../controllers/game/game-creation/nih-game/nihController";

const router = express.Router();

router.post('/game/:gameId/player/:playerId/change-location', changeLocation);
router.post('/game/:gameId/player/:playerId/use-item', useItem);
router.get('/game/:gameId/player/:playerId/inventory', getInventory);
router.get('/game/:gameId/player/:playerId/state', getGameState); // Add this route

export default router;