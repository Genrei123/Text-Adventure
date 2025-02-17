import { Request, Response } from "express";
import { validateUserAndGame, getChatHistory, findOrCreateSession, callOpenAI, storeChatMessage, initiateGameSession } from "../../service/chat/chatService";
 

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
        // Initiate game session
        const { userId, gameId, message } = req.body;
        
        // First validate and get session
        await validateUserAndGame(userId, gameId);
        const session_id = await findOrCreateSession(userId, gameId);
        
        // Properly format messages for OpenAI
        const gameSession = await initiateGameSession(userId, gameId);
        
        // Create proper message array for OpenAI
        const formattedMessages: { role: "system" | "user" | "assistant"; content: any }[] = [
            {
                role: "system",
                content: gameSession
            },
            {
                role: "user",
                content: message || "Hello" // Make sure messages has a value
            }
        ];
        const messages = await callOpenAI(formattedMessages);
        // Store the message
        const response = await storeChatMessage(session_id, userId, gameId, "user", messages);
        res.status(200).json(response);  // Use json() instead of send() for consistency
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });  // Return error as JSON
    }
};