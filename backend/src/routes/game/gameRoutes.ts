import express, { Request, Response } from 'express';
import { 
  getGameById, 
  getAllGames, 
  createGame, 
  getComments, 
  getRatings, 
  addComment, 
  addRating, 
  getGameByUsername, 
  getGameByTitle 
} from '../../controllers/game/game-creation/gameController';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.get('/search', getGameByTitle);
router.post('/add-game', createGame);
router.get('/:id/comments', getComments);
router.get('/:id/ratings', getRatings);
router.post('/:id/comments', addComment);
router.post('/:id/ratings', addRating);
router.get('/games/user/:username', getGameByUsername);

export default router;