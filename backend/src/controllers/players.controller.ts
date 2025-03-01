import { Request, Response } from 'express';
import sequelize from '../service/database';
import { QueryResult } from '../interfaces/database';

export const getPlayers = async (req: Request, res: Response) => {
  const { search, status, subscription, sortBy, sortOrder, page, limit } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let query = 'SELECT * FROM users WHERE 1=1';
  if (search) query += ` AND username ILIKE '%${search}%'`;
  if (status && status !== 'all') query += ` AND status = '${status}'`;
  if (subscription && subscription !== 'all') query += ` AND subscription = '${subscription}'`;
  query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`;

  try {
    const result = await sequelize.query<QueryResult>(query, { type: sequelize.QueryTypes.SELECT });
    const total = await sequelize.query<QueryResult>('SELECT COUNT(*) FROM users', { type: sequelize.QueryTypes.SELECT });
    res.json({ items: result, total: parseInt(total[0].count) });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Error fetching players' });
  }
};