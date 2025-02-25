import Session from "../../model/session";

/**
 * Creates a new session.
 * @param email - The email associated with the session.
 * @returns The created session.
 */
export async function createSession(email: string): Promise<Session> {
  try {
    const newSession = await Session.create({
      email,
      startTime: new Date(),
      sessionData: {
        interactions: [],
        gamesCreated: [],
        gamesPlayed: [],
        visitedPages: [],
      },
    });
    return newSession;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

/**
 * Adds a page visit to a session.
 * @param sessionId - The ID of the session.
 * @param page - The page visited.
 * @returns The updated session.
 */
export async function addPageVisit(sessionId: string, page: string): Promise<Session | null> {
    try {
      console.log("addPageVisit function called");
  
      console.log("addPageVisit called with sessionId:", sessionId);
      console.log("addPageVisit called with page:", page);
  
      // Find the session by ID
      const session = await Session.findByPk(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }
  
      console.log("Session found:", session);
  
      // Add the page visit
      session.sessionData.visitedPages.push(page);
      console.log("Page added to visitedPages:", session.sessionData.visitedPages);
  
      // Save the updated session
      await session.save();
      console.log("Session updated with new page visit");
  
      return session;
    } catch (error) {
      console.error("Error adding page visit:", error);
      throw error;
    }
  }

/**
 * Clears a session and inserts the data into the database.
 * @param sessionId - The ID of the session.
 * @param visitedPages - The visited pages to be inserted.
 */
export async function clearSession(sessionId: string, visitedPages: string[]): Promise<void> {
    try {
      console.log("clearSession function called");
  
      console.log("clearSession called with sessionId:", sessionId);
      console.log("clearSession called with visitedPages:", visitedPages);
  
      // Find the session by ID
      const session = await Session.findByPk(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }
  
      console.log("Session found:", session);
  
      // Insert the session data into the database
      await Session.create({
        email: session.email,
        startTime: session.startTime,
        endTime: new Date(),
        sessionData: {
          ...session.sessionData,
          visitedPages,
        },
      });
  
      console.log("Session data inserted into the database");
  
      // Delete the session
      await session.destroy();
      console.log("Session deleted");
    } catch (error) {
      console.error("Error clearing session:", error);
      throw error;
    }
  }