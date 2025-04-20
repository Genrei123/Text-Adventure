import express from 'express';
import { 
  changeLocation, 
  useItem, 
  getInventory,
  getGameState, // Add this import
  startNewGame,
  endGameEarly
} from "../../../controllers/game/game-creation/nih-game/nihController";

const router = express.Router();

router.post('/game/:gameId/player/:playerId/change-location', changeLocation);
router.post('/game/:gameId/player/:playerId/use-item', useItem);
router.get('/game/:gameId/player/:playerId/inventory', getInventory);
router.get('/game/:gameId/player/:playerId/state', getGameState); // Add this route
router.post('/game/:gameId/player/:playerId/start-new-game', startNewGame);
router.post('/game/:gameId/player/:playerId/end-game-early', endGameEarly);

export default router;