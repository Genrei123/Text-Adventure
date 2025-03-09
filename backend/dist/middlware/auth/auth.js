"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../model/user/user"));
const cookieJwtAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_1.default.findByPk(decoded.id);
        if (!user) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }
        req.user = user; // Store the user information in the request object
        next();
    }
    catch (error) {
        res.clearCookie("token");
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.default = cookieJwtAuth;
//# sourceMappingURL=auth.js.map