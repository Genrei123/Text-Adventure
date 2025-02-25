import { Request, Response } from "express";
import { createSession, addPageVisit, clearSession } from "../../service/session/sessionService";

export const createSessionController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("Received createSession request:", req.body);
    const session = await createSession(email);
    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPageVisitController = async (req: Request, res: Response) => {
  try {
    const { sessionId, page } = req.body;
    console.log("Received addPageVisit request:", req.body);
    const session = await addPageVisit(sessionId, page);
    res.status(200).json(session);
  } catch (error) {
    console.error("Error adding page visit:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const clearSessionController = async (req: Request, res: Response) => {
  try {
    const { sessionId, visitedPages } = req.body;
    console.log("Received clearSession request:", req.body);
    await clearSession(sessionId, visitedPages);
    res.status(200).json({ message: "Session cleared successfully" });
  } catch (error) {
    console.error("Error clearing session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};