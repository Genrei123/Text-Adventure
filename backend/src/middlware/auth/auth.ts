import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

const cookieJwtAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    const token = req.cookies.token;
    try {
        const user = Jwt.verify(token, 'test');
        req.cookies.token = user;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/");
    }
};

export default cookieJwtAuth;