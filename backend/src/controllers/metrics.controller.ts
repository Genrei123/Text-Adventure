import { Request, Response } from 'express';
import sequelize from '../service/database';
import { QueryResult } from '../interfaces/database';

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const [emailVerified, activePlayers, offlinePlayers] = await Promise.all([
      sequelize.query<QueryResult>('SELECT COUNT(*) FROM users WHERE "emailVerified" = true', { type: sequelize.QueryTypes.SELECT }),
      sequelize.query<QueryResult>(`
        SELECT COUNT(DISTINCT user_id) 
        FROM sessions 
        WHERE "endTime" IS NULL 
        OR "endTime" > NOW() - INTERVAL '15 minutes'
      `, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query<QueryResult>(`
        SELECT COUNT(*) 
        FROM users 
        WHERE id NOT IN (
          SELECT DISTINCT user_id 
          FROM sessions 
          WHERE "endTime" IS NULL 
          OR "endTime" > NOW() - INTERVAL '15 minutes'
        )
      `, { type: sequelize.QueryTypes.SELECT })
    ]);

    res.json({
      emailVerifiedCount: parseInt(emailVerified[0].count),
      activePlayersCount: parseInt(activePlayers[0].count),
      offlinePlayersCount: parseInt(offlinePlayers[0].count)
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Error fetching metrics' });
  }
};

export const getGamesCount = async (req: Request, res: Response) => {
  try {
    const result = await sequelize.query<QueryResult>('SELECT COUNT(*) FROM games', { type: sequelize.QueryTypes.SELECT });
    res.json({ count: parseInt(result[0].count) });
  } catch (error) {
    console.error('Error fetching games count:', error);
    res.status(500).json({ error: 'Error fetching games count' });
  }
};