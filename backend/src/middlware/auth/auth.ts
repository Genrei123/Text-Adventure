import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../model/user/user";

const cookieJwtAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
    req.user = user; // Store the user information in the request object
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default cookieJwtAuth;