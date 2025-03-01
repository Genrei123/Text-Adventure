"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatRequestController = exports.getChatHistoryController = void 0;
const chatService_1 = require("../../service/chat/chatService");
const getChatHistoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, gameId } = req.body;
        yield (0, chatService_1.validateUserAndGame)(userId, gameId);
        const chatHistory = yield (0, chatService_1.getChatHistory)(userId, gameId);
        res.status(200).send(chatHistory);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: errorMessage });
    }
});
exports.getChatHistoryController = getChatHistoryController;
const handleChatRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, gameId, message } = req.body;
        if (!message) {
            throw new Error("Message is required");
        }
        yield (0, chatService_1.validateUserAndGame)(userId, gameId);
        const session_id = yield (0, chatService_1.findOrCreateSession)(userId, gameId);
        const gameSession = yield (0, chatService_1.initiateGameSession)(userId, gameId);
        const conversationHistory = yield (0, chatService_1.getConversationHistory)(session_id, userId, gameId);
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
        yield (0, chatService_1.storeChatMessage)(session_id, userId, gameId, "user", message);
        const aiResponse = yield (0, chatService_1.callOpenAI)(formattedMessages);
        const storedResponse = yield (0, chatService_1.storeChatMessage)(session_id, userId, gameId, "assistant", aiResponse);
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
});
exports.handleChatRequestController = handleChatRequestController;
//# sourceMappingURL=chatController.js.map