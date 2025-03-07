import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

export const getPlayers = async (req: Request, res: Response) => {
  const { search, status, subscription, sortBy, sortOrder, page, limit } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let query = 'SELECT * FROM "Users" WHERE 1=1';
  if (search) query += ` AND "username" ILIKE '%${search}%'`;
  if (status && status !== 'all') query += ` AND "status" = '${status}'`;
  if (subscription && subscription !== 'all') query += ` AND "subscription" = '${subscription}'`;
  query += ` ORDER BY "${sortBy}" ${sortOrder} LIMIT ${limit} OFFSET ${offset}`;

  try {
    const result = await sequelize.query(query, { type: QueryTypes.SELECT });
    const total = await sequelize.query('SELECT COUNT(*) FROM "Users"', { type: QueryTypes.SELECT });
    res.json({ items: result, total: parseInt((total[0] as { count: string }).count) });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Error fetching players' });
  }
};