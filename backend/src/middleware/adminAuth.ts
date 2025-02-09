import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.admin) return res.status(403).json({ error: 'Admin access required' });
  next();
};