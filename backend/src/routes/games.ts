import { Router } from 'express';
import Game from '../model/game/game';

const router = Router();

router.get('/recent', async (req, res) => {
  try {
    const recentGames = await Game.findAll({
      order: [['createdAt', 'DESC']], // Use correct column name
      limit: 5,
      attributes: ['title', 'description', 'createdAt', 'status'] // Use correct column name
    });

    res.json(recentGames.map(g => ({
      title: g.title,
      excerpt: g.description.substring(0, 100),
      created: g.createdAt.toISOString(),
      status: g.status || 'draft'
    })));
  } catch (error) {
    console.error('Recent games error:', error);
    res.status(500).json({ error: 'Failed to load recent games' });
  }
});

export default router;