import { Request, Response } from "express";
import { validateUserAndGame, getChatHistory, findOrCreateSession, callOpenAI, storeChatMessage } from "../../service/chat/chatService";

export const getChatHistoryController = async (req: Request, res: Response) => {
    try {
        const { userId, gameId } = req.body;
        await validateUserAndGame(userId, gameId);
        const chatHistory = await getChatHistory(userId, gameId);
        res.status(200).send(chatHistory);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: errorMessage });
    }
};

export const handleChatRequestController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, gameId, message } = req.body;
        if (!message) return res.status(400).send("Invalid request body.");

        await validateUserAndGame(userId, gameId);
        const session_id = await findOrCreateSession(userId, gameId);

        const previousChats = await getChatHistory(userId, gameId);
        const messages = previousChats.map((chat) => ({ role: chat.role, content: chat.content }));
        messages.push({ role: "user", content: message });

        const reply = await callOpenAI(messages);
        await storeChatMessage(session_id, userId, gameId, "assistant", reply);

        res.status(200).send({ message: reply });

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};