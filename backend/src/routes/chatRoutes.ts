import express from "express";
import { handleChatRequest } from "../controllers/chat/chatController";

const router = express.Router();

router.post("/chat", handleChatRequest);

export default router;
