"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_1 = require("../../websocket/socket"); // Import playerSessions
const date_fns_1 = require("date-fns"); // Import date-fns functions
const sequelize_1 = require("sequelize"); // Import Sequelize operators
const session_1 = __importDefault(require("../../model/session")); // Import Session model
const router = express_1.default.Router();
// Endpoint to retrieve daily activities
router.get("/daily-activities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield session_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)), // Get activities from the start of the day
                },
            },
        });
        const formattedActivities = activities.map(activity => {
            const endTime = activity.endTime ? activity.endTime : new Date();
            const durationInSeconds = (0, date_fns_1.differenceInSeconds)(endTime, activity.startTime);
            const durationInMinutes = (0, date_fns_1.differenceInMinutes)(endTime, activity.startTime);
            const durationInHours = (0, date_fns_1.differenceInHours)(endTime, activity.startTime);
            const sessionData = activity.sessionData; // Type assertion to access sessionData properties
            return {
                email: activity.email,
                startTime: (0, date_fns_1.format)(activity.startTime, 'yyyy-MM-dd HH:mm:ss'),
                endTime: activity.endTime ? (0, date_fns_1.format)(activity.endTime, 'yyyy-MM-dd HH:mm:ss') : null,
                duration: `${durationInHours} hours, ${durationInMinutes % 60} minutes, ${durationInSeconds % 60} seconds`,
                gamesCreated: sessionData.gamesCreated,
                gamesPlayed: sessionData.gamesPlayed,
                interactions: sessionData.interactions,
                visitedPages: sessionData.visitedPages,
            };
        });
        res.json(formattedActivities);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve activities' });
    }
}));
// Existing endpoint to retrieve player activity by email
router.get("/player-activity/:email", (req, res) => {
    const { email } = req.params;
    const session = socket_1.playerSessions.get(email);
    if (session) {
        const endTime = session.endTime ? session.endTime : new Date();
        const durationInSeconds = (0, date_fns_1.differenceInSeconds)(endTime, session.startTime);
        const durationInMinutes = (0, date_fns_1.differenceInMinutes)(endTime, session.startTime);
        const durationInHours = (0, date_fns_1.differenceInHours)(endTime, session.startTime);
        const sessionData = session.sessionData; // Type assertion to access sessionData properties
        res.json({
            email,
            startTime: (0, date_fns_1.format)(session.startTime, 'yyyy-MM-dd HH:mm:ss'),
            endTime: session.endTime ? (0, date_fns_1.format)(session.endTime, 'yyyy-MM-dd HH:mm:ss') : null,
            duration: `${durationInHours} hours, ${durationInMinutes % 60} minutes, ${durationInSeconds % 60} seconds`,
            gamesCreated: sessionData.gamesCreated,
            gamesPlayed: sessionData.gamesPlayed,
            interactions: sessionData.interactions,
            visitedPages: sessionData.visitedPages,
        });
    }
    else {
        res.status(404).json({ message: "No session data found for this email" });
    }
});
exports.default = router;
//# sourceMappingURL=playerActivityRoutes.js.map