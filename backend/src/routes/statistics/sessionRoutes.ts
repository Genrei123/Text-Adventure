import { Router } from "express";
import { createSessionController, addPageVisitController, clearSessionController, deleteSessionsWithNoEndTimeController, getPlayerVisitsController } from "../../controllers/session/sessionController";

const router = Router();

// Route to create a new session
router.post("/createSession", (req, res) => {
  //console.log("Received createSession request:", req.body);
  createSessionController(req, res);
});

// Route to add a page visit to a session
router.post("/addPageVisit", (req, res) => {
  //console.log("Received addPageVisit request:", req.body);
  addPageVisitController(req, res);
});

// Route to clear a session
router.post("/clearSession", (req, res) => {
  //console.log("Received clearSession request:", req.body);
  clearSessionController(req, res);
});

router.delete('/delete-sessions-no-end-time', deleteSessionsWithNoEndTimeController);

// Route to get sessions by email (accepts query parameter)
router.get('/get-sessions-by-email', (req, res) => {
  //console.log("Received get-sessions-by-email request:", req.query);
  getPlayerVisitsController(req, res);
});

export default router;