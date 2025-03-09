"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../../model/user/user"));
const activeUser_1 = require("../../shared/websocket/activeUser"); // Import activeUserEmails
const router = express_1.default.Router();
router.get("/player-stats", async (req, res) => {
    try {
        const totalPlayers = await user_1.default.count();
        const activePlayers = activeUser_1.activeUserEmails.size;
        const offlinePlayers = totalPlayers - activePlayers;
        const activeSessions = activePlayers; // Assuming each active player has one active session
        res.json({
            totalPlayers,
            activePlayers,
            offlinePlayers,
            activeSessions,
        });
    }
    catch (error) {
        console.error('Error fetching player statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=statsRoutes.js.map