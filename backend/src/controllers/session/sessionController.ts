import { Request, Response } from "express";
import { createSession, addPageVisits, clearSession, deleteSessionsWithNoEndTime, getAllSessionsByEmail } from "../../service/session/sessionService";

export const getSessionsController = async (req: Request, res: Response) => {
  try {
    console.log("Received getSessions request");
    res.status(200).json({ message: "Get sessions" });
  } catch (error) {
    console.error("Error getting sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPlayerVisitsController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("Received getPlayerVisits request:", req.body);
    const sessions = await getAllSessionsByEmail(email);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error getting player visits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    const { sessionId, pages, localStorageData } = req.body; // Include localStorageData
    console.log("Received addPageVisit request:", req.body);
    const session = await addPageVisits(sessionId, pages, localStorageData); // Pass localStorageData
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
    res.status(200).json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error clearing session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteSessionsWithNoEndTimeController = async (req: Request, res: Response) => {
  try {
    console.log("Received deleteSessionsWithNoEndTime request");
    const result = await deleteSessionsWithNoEndTime();
    res.status(200).json({ message: "Sessions with no end time deleted successfully", result });
  } catch (error) {
    console.error("Error deleting sessions with no end time:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};