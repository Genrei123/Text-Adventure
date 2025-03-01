import { Request, Response } from 'express';
import sequelize from '../config/sequelize';

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const [emailVerified, activePlayers, offlinePlayers] = await Promise.all([
      sequelize.query('SELECT COUNT(*) FROM users WHERE "emailVerified" = true', { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(DISTINCT "UserId") FROM sessions 
        WHERE "endTime" IS NULL OR "endTime" > NOW() - INTERVAL '15 minutes'`, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) FROM users 
        WHERE id NOT IN (SELECT DISTINCT "UserId" FROM sessions 
        WHERE "endTime" IS NULL OR "endTime" > NOW() - INTERVAL '15 minutes')`, { type: sequelize.QueryTypes.SELECT })
    ]);

    res.json({
      emailVerifiedCount: Number(emailVerified[0].count),
      activePlayersCount: Number(activePlayers[0].count),
      offlinePlayersCount: Number(offlinePlayers[0].count)
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Error fetching metrics' });
  }
};

export const getGamesCount = async (req: Request, res: Response) => {
  try {
    const result = await sequelize.query('SELECT COUNT(*) FROM games', { type: sequelize.QueryTypes.SELECT });
    res.json({ count: Number(result[0].count) });
  } catch (error) {
    console.error('Error fetching games count:', error);
    res.status(500).json({ error: 'Error fetching games count' });
  }
};