"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatRequestController = exports.getChatHistoryController = void 0;
const chatService_1 = require("../../service/chat/chatService");
const getChatHistoryController = async (req, res) => {
    try {
        const { userId, gameId } = req.body;
        await (0, chatService_1.validateUserAndGame)(userId, gameId);
        const chatHistory = await (0, chatService_1.getChatHistory)(userId, gameId);
        res.status(200).send(chatHistory);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: errorMessage });
    }
};
exports.getChatHistoryController = getChatHistoryController;
const handleChatRequestController = async (req, res) => {
    try {
        const { userId, gameId, message } = req.body;
        if (!message) {
            throw new Error("Message is required");
        }
        await (0, chatService_1.validateUserAndGame)(userId, gameId);
        const session_id = await (0, chatService_1.findOrCreateSession)(userId, gameId);
        const gameSession = await (0, chatService_1.initiateGameSession)(userId, gameId);
        const conversationHistory = await (0, chatService_1.getConversationHistory)(session_id, userId, gameId);
        const formattedMessages = [
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
        await (0, chatService_1.storeChatMessage)(session_id, userId, gameId, "user", message);
        const aiResponse = await (0, chatService_1.callOpenAI)(formattedMessages);
        const storedResponse = await (0, chatService_1.storeChatMessage)(session_id, userId, gameId, "assistant", aiResponse);
        res.status(200).json({
            session_id,
            user_message: { content: message, createdAt: new Date() },
            ai_response: storedResponse
        });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
};
exports.handleChatRequestController = handleChatRequestController;
//# sourceMappingURL=chatController.js.map