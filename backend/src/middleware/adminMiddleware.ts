import { Request, Response, NextFunction } from "express";

// Commenting out the requireAdmin middleware for testing purposes
// export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
//   if (!req.user?.admin) {
//     res.status(403).json({ error: 'Admin access required' });
//     return;
//   }
//   next();
// };

