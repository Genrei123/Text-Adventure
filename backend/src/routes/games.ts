import { Router } from 'express';
import { Game } from '../model/game';

const router = Router();

router.get('/recent', async (req, res) => {
  try {
    const recentGames = await Game.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    res.json(recentGames.map(game => ({
      title: game.title,
      excerpt: game.description.substring(0, 100),
      created: game.createdAt.toISOString(),
      status: game.status
    })));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recent games' });
  }
});

export default router;