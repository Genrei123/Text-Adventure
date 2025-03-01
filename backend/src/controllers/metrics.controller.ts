import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

interface CountResult {
  count: string;
}

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const [emailVerified, gamesResult] = await Promise.all([
      sequelize.query<CountResult>(
        'SELECT COUNT(*) FROM users WHERE "email_verified" = true',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<CountResult>(
        'SELECT COUNT(*) FROM games',
        { type: QueryTypes.SELECT }
      )
    ]);

    res.json({
      emailVerifiedCount: Number(emailVerified[0].count),
      activePlayersCount: 45, // Mock data
      offlinePlayersCount: 155, // Mock data
      gamesCount: Number(gamesResult[0].count)
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Error fetching metrics' });
  }
};

export const getGamesCount = async (req: Request, res: Response) => {
  try {
    const result = await sequelize.query<CountResult>(
      'SELECT COUNT(*) FROM games',
      { type: QueryTypes.SELECT }
    );
    res.json({ count: Number(result[0].count) });
  } catch (error) {
    console.error('Error fetching games count:', error);
    res.status(500).json({ error: 'Error fetching games count' });
  }
};