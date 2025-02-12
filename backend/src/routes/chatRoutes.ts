import express from "express";
import { handleChatRequest } from "../controllers/chatController";

const router = express.Router();

router.post("/chat", handleChatRequest);

export default router;
