import { Op } from 'sequelize';
import Session from "../../model/session";
import { SessionData } from "../../interfaces/session/sessionInterface";

/**
 * Creates a new session.
 * @param email - The email associated with the session.
 * @returns The created session.
 */
export async function createSession(email: string): Promise<Session> {
  try {
    // Call deleteSessionsWithNoEndTime directly
    await deleteSessionsWithNoEndTime();

    const newSession = await Session.create({
      email,
      startTime: new Date(),
      sessionData: {
        interactions: [],
        gamesCreated: [],
        gamesPlayed: [],
        visitedPages: {},
      } as SessionData,
    });
    console.log("Session created:", newSession);
    return newSession;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

/**
 * Helper function to count occurrences of each page.
 * @param pages - The array of visited pages.
 * @param currentCounts - The current counts of visited pages.
 * @returns An object with updated page counts.
 */
function countPageVisits(pages: string[], currentCounts: Record<string, number>): Record<string, number> {
  return pages.reduce((acc, page) => {
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, currentCounts);
}

/**
 * Adds page visits to a session.
 * @param sessionId - The ID of the session.
 * @param pages - The pages visited.
 * @param localStorageData - The local storage data from the frontend.
 * @returns The updated session.
 */
export async function addPageVisits(sessionId: string, pages: string[], localStorageData: string): Promise<Session | null> {
  try {
    console.log("addPageVisits function called");

    console.log("addPageVisits called with sessionId:", sessionId);
    console.log("addPageVisits called with pages:", pages);
    console.log("Local storage data:", localStorageData);

    // Find the session by ID
    const session = await Session.findByPk(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    console.log("Session found:", session);

    // Ensure sessionData is correctly initialized
    let sessionData = session.sessionData || {
      interactions: [],
      gamesCreated: [],
      gamesPlayed: [],
      visitedPages: {},
    };

    // Ensure visitedPages exists before updating
    sessionData.visitedPages = countPageVisits(pages, sessionData.visitedPages || {});

    console.log("Updated visitedPages:", sessionData.visitedPages);

    // ✅ Update session data
    session.set("sessionData", sessionData);
    session.changed("sessionData", true);

    // ✅ Ensure endTime is updated (optional: remove this if you want it only in clearSession)
    session.set("endTime", new Date());
    session.changed("endTime", true);

    // Save changes
    await session.save();

    console.log("Session updated with new page visits and endTime");

    // Fetch updated session from DB to verify changes
    const updatedSession = await Session.findByPk(sessionId);
    console.log("Updated session from DB:", updatedSession?.sessionData);

    return updatedSession;
  } catch (error) {
    console.error("Error adding page visits:", error);
    throw error;
  }
}

/**
 * Clears a session and updates the endTime in the database.
 * @param sessionId - The ID of the session.
 * @param visitedPages - The visited pages to be inserted.
 */
export async function clearSession(sessionId: string, visitedPages: string[]): Promise<void> {
  try {
    // Call deleteSessionsWithNoEndTime directly
    await deleteSessionsWithNoEndTime();

    console.log("clearSession function called");

    console.log("clearSession called with sessionId:", sessionId);
    console.log("clearSession called with visitedPages:", visitedPages);

    // Find the session by ID
    const session = await Session.findByPk(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    console.log("Session found:", session);

    // Update the session data and endTime
    session.set("endTime", new Date()); // ✅ Ensure Sequelize detects the change
    session.changed("endTime", true); // ✅ Explicitly mark the field as changed

    session.sessionData.visitedPages = countPageVisits(visitedPages, session.sessionData.visitedPages || {});

    // Save changes
    await session.save();

    console.log("Session ended:", session);
  } catch (error) {
    console.error("Error ending session:", error);
    throw error;
  }
}

/**
 * Deletes sessions with no end time.
 * @returns The number of deleted sessions.
 */
export async function deleteSessionsWithNoEndTime(): Promise<number> {
  try {
    const result = await Session.destroy({
      where: {
          endTime: { [Op.is]: null as any }
      },
  });
    console.log("Sessions with no end time deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting sessions with no end time:", error);
    throw error;
  }
}

/**
 * Gets a session by its ID.
 * @param sessionId - The ID of the session to retrieve.
 * @returns The session if found, null otherwise.
 */
export async function getSessionById(sessionId: string): Promise<Session | null> {
  try {
    console.log("getSessionById function called with sessionId:", sessionId);

    // Find the session by ID
    const session = await Session.findByPk(sessionId);
    
    if (!session) {
      console.log("Session not found for ID:", sessionId);
      return null;
    }

    console.log("Session found:", session.id);
    return session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    throw error;
  }
}

/**
 * Gets active sessions for a specific email.
 * @param email - The email to find active sessions for.
 * @returns Array of active sessions.
 */
export async function getActiveSessionsByEmail(email: string): Promise<Session[]> {
  try {
    console.log("getActiveSessionsByEmail function called with email:", email);

    // Find active sessions (where endTime is null)
    const sessions = await Session.findAll({
      where: {
        email,
        endTime: { [Op.is]: null as any }
      }
    });

    console.log(`Found ${sessions.length} active sessions for email:`, email);
    return sessions;
  } catch (error) {
    console.error("Error retrieving active sessions:", error);
    throw error;
  }
}

/**
 * Gets all sessions for a specific email.
 * @param email - The email to find sessions for.
 * @returns Array of all sessions.
 */
export async function getAllSessionsByEmail(email: any): Promise<Session[]> {
  if (Array.isArray(email)) {
    email = email[0];
  }
  console.log("getAllSessionsByEmail function called with email:", email);
  
  if (!email) {
    console.warn("Email is undefined in getAllSessionsByEmail");
    return [];
  }

  const sessions = await Session.findAll({
    where: { email },
    order: [['startTime', 'DESC']]
  });

  console.log(`Found ${sessions.length} sessions for email:`, email);
  return sessions;
}

/**
 * Gets the most recent session for a specific email.
 * @param email - The email to find the most recent session for.
 * @returns The most recent session if found, null otherwise.
 */
export async function getMostRecentSessionByEmail(email: string): Promise<Session | null> {
  try {
    console.log("getMostRecentSessionByEmail function called with email:", email);

    // Find most recent session for this email
    const session = await Session.findOne({
      where: { email },
      order: [['startTime', 'DESC']]
    });

    if (!session) {
      console.log("No sessions found for email:", email);
      return null;
    }

    console.log("Most recent session found:", session.id);
    return session;
  } catch (error) {
    console.error("Error retrieving most recent session:", error);
    throw error;
  }
}