import { Router } from "express";
import { createSessionController, addPageVisitController } from "../../controllers/session/sessionController";

const router = Router();

// Route to create a new session
router.post("/createSession", createSessionController);

// Route to add a page visit to a session
router.post("/addPageVisit", addPageVisitController);

export default router;