import { Router } from "express";
import { createSessionController, addPageVisitController, clearSessionController } from "../../controllers/session/sessionController";

const router = Router();

// Route to create a new session
router.post("/createSession", (req, res) => {
  console.log("Received createSession request:", req.body);
  createSessionController(req, res);
});

// Route to add a page visit to a session
router.post("/addPageVisit", (req, res) => {
  console.log("Received addPageVisit request:", req.body);
  addPageVisitController(req, res);
});

// Route to clear a session
router.post("/clearSession", (req, res) => {
  console.log("Received clearSession request:", req.body);
  clearSessionController(req, res);
});

export default router;