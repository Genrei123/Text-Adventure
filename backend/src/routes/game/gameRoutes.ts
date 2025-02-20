import express from 'express';
import { getGameById, getAllGames, createGame } from '../../controllers/game/game-creation/gameController';
import e from 'cors';

const router = express.Router();


router.get('/', getAllGames);
router.get('/:id', getGameById);
router.post('/add-game', createGame);

export default router;
