import { Router } from 'express';
import Game from '../model/game/game';

const router = Router();

router.get('/recent', async (req, res) => {
  try {
    const recentGames = await Game.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['title', 'description', 'createdAt']
    });

    res.json(recentGames.map(g => ({
      title: g.title,
      excerpt: g.description.substring(0, 100),
      created: g.createdAt.toISOString()
    })));
  } catch (error) {
    console.error('Recent games error:', error);
    res.status(500).json({ error: 'Failed to load recent games' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const games = await Game.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'description', 'createdAt']
    });

    const gamesCount = await Game.count();

    res.json({
      games: games.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        created: g.createdAt.toISOString()
      })),
      count: gamesCount
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to load games' });
  }
});

export default router;