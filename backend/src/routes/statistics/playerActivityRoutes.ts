import express from "express";
import { playerSessions } from "../../websocket/socket"; // Import playerSessions
import { format, differenceInSeconds, differenceInMinutes, differenceInHours } from 'date-fns'; // Import date-fns functions
import { Op } from "sequelize"; // Import Sequelize operators
import Session from "../../model/session"; // Import Session model

const router = express.Router();

// Endpoint to retrieve daily activities
router.get("/daily-activities", async (req, res) => {
  try {
    const activities = await Session.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)), // Get activities from the start of the day
        },
      },
    });

    const formattedActivities = activities.map(activity => {
      const endTime = activity.endTime ? activity.endTime : new Date();
      const durationInSeconds = differenceInSeconds(endTime, activity.startTime);
      const durationInMinutes = differenceInMinutes(endTime, activity.startTime);
      const durationInHours = differenceInHours(endTime, activity.startTime);

      const sessionData = activity.sessionData as any; // Type assertion to access sessionData properties

      return {
        email: activity.email,
        startTime: format(activity.startTime, 'yyyy-MM-dd HH:mm:ss'),
        endTime: activity.endTime ? format(activity.endTime, 'yyyy-MM-dd HH:mm:ss') : null,
        duration: `${durationInHours} hours, ${durationInMinutes % 60} minutes, ${durationInSeconds % 60} seconds`,
        gamesCreated: sessionData.gamesCreated,
        gamesPlayed: sessionData.gamesPlayed,
        interactions: sessionData.interactions,
        visitedPages: sessionData.visitedPages,
      };
    });

    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve activities' });
  }
});

// Existing endpoint to retrieve player activity by email
router.get("/player-activity/:email", (req, res) => {
  const { email } = req.params;
  const session = playerSessions.get(email);

  if (session) {
    const endTime = session.endTime ? session.endTime : new Date();
    const durationInSeconds = differenceInSeconds(endTime, session.startTime);
    const durationInMinutes = differenceInMinutes(endTime, session.startTime);
    const durationInHours = differenceInHours(endTime, session.startTime);

    const sessionData = session.sessionData as any; // Type assertion to access sessionData properties

    res.json({
      email,  
      startTime: format(session.startTime, 'yyyy-MM-dd HH:mm:ss'),
      endTime: session.endTime ? format(session.endTime, 'yyyy-MM-dd HH:mm:ss') : null,
      duration: `${durationInHours} hours, ${durationInMinutes % 60} minutes, ${durationInSeconds % 60} seconds`,
      gamesCreated: sessionData.gamesCreated,
      gamesPlayed: sessionData.gamesPlayed,
      interactions: sessionData.interactions,
      visitedPages: sessionData.visitedPages,
    });
  } else {
    res.status(404).json({ message: "No session data found for this email" });
  }
});

export default router;