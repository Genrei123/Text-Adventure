import { Request, Response } from "express";
import { createSession, addPageVisit } from "../../service/session/sessionService";

/**
 * Controller to handle creating a new session.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function createSessionController(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
        const newSession = await createSession(email);
        res.status(201).json(newSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Controller to handle adding a page visit to a session.
 * @param req - The request object.
 * @param res - The response object.
 */
export async function addPageVisitController(req: Request, res: Response): Promise<void> {
    const { sessionId, page } = req.body;

    try {
        const updatedSession = await addPageVisit(sessionId, page);
        res.status(200).json(updatedSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}