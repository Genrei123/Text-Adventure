import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../model/user/user";

const jwtAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Get token from Authorization header (Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, email: string };
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
    req.user = user; // Attach the full user object to req.user
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default jwtAuth;