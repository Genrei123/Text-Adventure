import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const cookieJwtAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = user; // Store the user information in the request object
        next();
    } catch (error) {
        res.clearCookie("token");
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default cookieJwtAuth;