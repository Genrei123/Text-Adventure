import express, { Request, Response } from 'express';
import { getGameById, getAllGames, createGame, getComments, getRatings, addComment, addRating } from '../../controllers/game/game-creation/gameController';
import e from 'cors';
import { addGameComments } from '../../service/game-details/gameDetailsService';

const router = express.Router();


router.get('/', getAllGames);
router.get('/:id', getGameById);
router.post('/add-game', createGame);
router.get('/:id/comments', getComments);
router.get('/:id/ratings', getRatings);
router.post('/:id/comments', addComment);
router.post('/:id/ratings', addRating);


export default router;
