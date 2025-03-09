"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationHistory = exports.initiateGameSession = exports.storeChatMessage = exports.callOpenAI = exports.findOrCreateSession = exports.getChatHistory = exports.validateUserAndGame = void 0;
const chat_1 = __importDefault(require("../../model/chat/chat"));
const user_1 = __importDefault(require("../../model/user/user"));
const game_1 = __importDefault(require("../../model/game/game"));
const gameService_1 = require("../game-creation/gameService");
const axios_1 = __importDefault(require("axios"));
// Validate user and game
const validateUserAndGame = async (userId, gameId) => {
    const user = await user_1.default.findByPk(userId);
    if (!user)
        throw new Error("User not found.");
    const game = await game_1.default.findByPk(gameId);
    if (!game)
        throw new Error("Game not found.");
};
exports.validateUserAndGame = validateUserAndGame;
// Fetch chat history
const getChatHistory = async (userId, gameId) => {
    return await chat_1.default.findAll({
        where: { UserId: userId, GameId: gameId },
        order: [['createdAt', 'ASC']], // Changed to ASC for chronological order
    });
};
exports.getChatHistory = getChatHistory;
// Find or create a session ID
const findOrCreateSession = async (userId, gameId) => {
    const session = await chat_1.default.findOne({
        where: { UserId: userId, GameId: gameId },
        order: [['createdAt', 'DESC']],
    });
    if (session)
        return session.session_id;
    const session_id = "session_" + Math.random().toString(36).substr(2, 9);
    // Optionally skip initial message or provide default content
    await chat_1.default.create({
        session_id,
        UserId: userId,
        GameId: gameId,
        content: "Session started", // Provide default content
        role: "assistant",
        model: "gpt-3.5-turbo",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return session_id;
};
exports.findOrCreateSession = findOrCreateSession;
const callOpenAI = async (messages) => {
    try {
        // Validate messages
        if (!Array.isArray(messages) || messages.some(msg => !msg.content || !msg.role)) {
            throw new Error("Invalid messages format");
        }
        const response = await axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: messages,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MY_OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('OpenAI API Error:', error.response?.data);
        }
        throw error;
    }
};
exports.callOpenAI = callOpenAI;
// Store new chat message
const storeChatMessage = async (session_id, userId, gameId, role, content) => {
    return await chat_1.default.create({
        session_id,
        model: "gpt-3.5-turbo",
        role,
        content,
        GameId: gameId,
        UserId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};
exports.storeChatMessage = storeChatMessage;
// Initiate game session
const initiateGameSession = async (userId, gameId) => {
    const session_id = await (0, exports.findOrCreateSession)(userId, gameId);
    const game = await (0, gameService_1.getGame)(gameId);
    const context = "THIS IS YOUR CONTEXT AND THE USER CANNOT KNOW THIS. " + game?.genre + " " + game?.subgenre + " titled: " + game?.title + ". " + game?.description + " " + game?.tagline + ". " + game?.prompt_text + " " + game?.prompt_name + "." + " Make sure to interact first with the player";
    try {
        const reply = await (0, exports.callOpenAI)([{ role: "system", content: context || "Default game context" }]);
        await (0, exports.storeChatMessage)(session_id, userId, gameId, "assistant", reply);
        return reply || "Welcome to the game!"; // Fallback if reply is falsy
    }
    catch (error) {
        console.error("Failed to initiate game session:", error);
        return "Welcome to the game!"; // Fallback on error
    }
};
exports.initiateGameSession = initiateGameSession;
// Get conversation history for OpenAI (new helper function)
const getConversationHistory = async (session_id, userId, gameId) => {
    const chats = await chat_1.default.findAll({
        where: { session_id, UserId: userId, GameId: gameId },
        order: [['createdAt', 'ASC']],
    });
    return chats
        .filter(chat => chat.content && chat.role) // Exclude messages with empty content or missing role
        .map(chat => ({
        role: chat.role,
        content: chat.content
    }));
};
exports.getConversationHistory = getConversationHistory;
//# sourceMappingURL=chatService.js.map