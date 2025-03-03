import { Request, Response } from "express";
import { validateUserAndGame, getChatHistory, findOrCreateSession, callOpenAI, storeChatMessage, storeImageMessage, initiateGameSession, getConversationHistory } from "../../service/chat/chatService";

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

        if (!message) {
            throw new Error("Message is required");
        }

        await validateUserAndGame(userId, gameId);
        const session_id = await findOrCreateSession(userId, gameId);

        const gameSession = await initiateGameSession(userId, gameId);
        const conversationHistory = await getConversationHistory(session_id, userId, gameId);

        const formattedMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
            {
                role: "system",
                content: gameSession || "Default game context"
            },
            ...conversationHistory,
            {
                role: "user",
                content: message
            }
        ];

        await storeChatMessage(session_id, userId, gameId, "user", message);
        const aiResponse = await callOpenAI(formattedMessages);
        const storedResponse = await storeChatMessage(session_id, userId, gameId, "assistant", aiResponse);

        res.status(200).json({
            session_id,
            user_message: { content: message, createdAt: new Date() },
            ai_response: storedResponse
        });
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
};

export const storeImage = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, gameId, content, imageUrl, role } = req.body;

        if (!userId || !gameId || !imageUrl) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate user and game
        await validateUserAndGame(userId, gameId);

        // Store the image message
        const storedMessage = await storeImageMessage(
            userId,
            gameId,
            content || 'Scene visualized:',
            imageUrl,
            role || 'assistant'
        );

        return res.status(201).json({
            message: 'Image stored successfully',
            data: storedMessage
        });
    } catch (error) {
        console.error('Error storing image:', error);
        return res.status(500).json({
            error: 'Failed to store image',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};