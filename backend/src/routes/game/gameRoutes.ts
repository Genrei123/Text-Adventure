import express, { Request, Response, Router } from 'express';
import { getGameById, getAllGames, createGame, getComments, getRatings, addComment, addRating } from '../../controllers/game/game-creation/gameController';
import e from 'cors';
import { addGameComments } from '../../service/game-details/gameDetailsService';

const router = Router();


router.get('/all', getAllGames);
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await getGameById(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game by ID' });
  }
});
router.post('/add-game', createGame);
router.get('/:id/comments', getComments);
router.get('/:id/ratings', getRatings);
router.post('/:id/comments', addComment);
router.post('/:id/ratings', addRating);


export default router;
