import express from "express";
import { playerSessions } from "../../websocket/socket"; // Import playerSessions
import { format, differenceInSeconds, differenceInMinutes, differenceInHours } from 'date-fns'; // Import date-fns functions

const router = express.Router();

router.get("/player-activity/:email", (req, res) => {
  const { email } = req.params;
  const session = playerSessions.get(email);

  if (session) {
    const endTime = session.endTime ? session.endTime : new Date();
    const durationInSeconds = differenceInSeconds(endTime, session.startTime);
    const durationInMinutes = differenceInMinutes(endTime, session.startTime);
    const durationInHours = differenceInHours(endTime, session.startTime);

    res.json({
      email,
      startTime: format(session.startTime, 'yyyy-MM-dd HH:mm:ss'),
      endTime: session.endTime ? format(session.endTime, 'yyyy-MM-dd HH:mm:ss') : null,
      duration: `${durationInHours} hours, ${durationInMinutes % 60} minutes, ${durationInSeconds % 60} seconds`,
      interactions: session.interactions,
    });
  } else {
    res.status(404).json({ message: "No session data found for this email" });
  }
});

export default router;