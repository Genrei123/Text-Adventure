import express from "express";
import User from "../../model/user/user";
import { activeUserEmails } from "../../shared/websocket/activeUser"; // Import activeUserEmails

const router = express.Router();

router.get("/player-stats", async (req, res) => {
  try {
    const totalPlayers = await User.count();
    const activePlayers = activeUserEmails.size;
    const offlinePlayers = totalPlayers - activePlayers;
    const activeSessions = activePlayers; // Assuming each active player has one active session

    res.json({
      totalPlayers,
      activePlayers,
      offlinePlayers,
      activeSessions,
    });
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;