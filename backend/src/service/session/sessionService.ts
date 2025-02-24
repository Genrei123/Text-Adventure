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
        // Find the session by ID
        const session = await Session.findByPk(sessionId);
        if (!session) {
            throw new Error("Session not found");
        }

        // Add the page visit
        session.addPageVisit(page);

        // Save the updated session
        await session.save();

        return session;
    } catch (error) {
        console.error("Error adding page visit:", error);
        throw error;
    }
}