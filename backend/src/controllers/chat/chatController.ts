import { Request, Response } from "express";
import { validateUserAndGame, getChatHistory, findOrCreateSession, callOpenAI, storeChatMessage, initiateGameSession, getConversationHistory } from "../../service/chat/chatService";

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
        const storedResponse = await storeChatMessage(
            session_id, 
            userId, 
            gameId, 
            "assistant", 
            aiResponse.content,
            undefined,  // No image URL
            aiResponse.roleplay_metadata
        );

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

export const storeBannerImage = async (req: Request, res: Response): Promise<any> => {
    try {
        const { 
            userId, 
            gameId, 
            content, 
            imageUrl, 
            role = 'assistant',
            // Optional roleplay metadata
            roleplay_emotion,
            roleplay_action,
            roleplay_character_state,
            roleplay_narrative_impact
        } = req.body;

        // Validate required fields
        if (!userId || !gameId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate user and game
        await validateUserAndGame(userId, gameId);

        // Find or create a session
        const session_id = await findOrCreateSession(userId, gameId);

        // Store the image message with optional roleplay metadata
        const storedMessage = await storeChatMessage(
            session_id,
            userId,
            gameId,
            role,
            content || 'Scene visualized:',
            imageUrl,
            // Pass roleplay metadata if provided
            {
                emotion: roleplay_emotion,
                action: roleplay_action,
                character_state: roleplay_character_state,
                narrative_impact: roleplay_narrative_impact
            }
        );

        return res.status(201).json({
            message: 'Image stored successfully',
            data: {
                imageUrl,
                gameId,
                // Include roleplay metadata in response
                roleplay_metadata: {
                    emotion: storedMessage.roleplay_emotion,
                    action: storedMessage.roleplay_action,
                    character_state: storedMessage.roleplay_character_state,
                    narrative_impact: storedMessage.roleplay_narrative_impact
                }
            }
        });
    } catch (error) {
        console.error('Error storing image:', error);
        return res.status(500).json({
            error: 'Failed to store image',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const storeImageMessage = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, gameId, image_url, role = 'assistant' } = req.body;

        // Validate required fields
        if (!userId || !gameId || !image_url) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate user and game
        await validateUserAndGame(userId, gameId);

        // Find or create a session
        const session_id = await findOrCreateSession(userId, gameId);

        // Store the image message
        const storedMessage = await storeChatMessage(
            session_id,
            userId,
            gameId,
            role,
            'Image received',
            image_url
        );

        return res.status(201).json({
            message: 'Image stored successfully',
            data: {
                image_url,
                gameId,
                // Include roleplay metadata in response
                roleplay_metadata: {
                    emotion: storedMessage.roleplay_emotion,
                    action: storedMessage.roleplay_action,
                    character_state: storedMessage.roleplay_character_state,
                    narrative_impact: storedMessage.roleplay_narrative_impact
                }
            }
        });
    } catch (error) {
        console.error('Error storing image:', error);
        return res.status(500).json({
            error: 'Failed to store image',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};