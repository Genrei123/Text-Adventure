import express, { Request, Response, Router } from 'express';
import { 
  getGameById, 
  getAllGames, 
  createGame, 
  getComments, 
  getRatings, 
  addComment, 
  addRating, 
  getGameByUsername, 
  getGameByTitle,
} from '../../controllers/game/game-creation/gameController';
import { reportComment } from '../../controllers/game/commentController';

const router = Router();

// Routes from both branches
router.get('/all', getAllGames); // Kept HEAD's route
router.get('/', getAllGames);    // Added main's alternative route
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await getGameById(req, res); // Using HEAD's error handling approach
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game by ID' });
  }
});
router.get('/search', getGameByTitle); // From main
router.post('/add-game', createGame);
router.get('/:id/comments', getComments);
router.get('/:id/ratings', getRatings);
router.post('/:id/comments', addComment);
router.post('/:id/ratings', addRating);
router.get('/games/user/:username', getGameByUsername);

// Report a comment
router.post('/comments/:id/report', reportComment);

export default router;