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
const validateUserAndGame = (userId, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(userId);
    if (!user)
        throw new Error("User not found.");
    const game = yield game_1.default.findByPk(gameId);
    if (!game)
        throw new Error("Game not found.");
});
exports.validateUserAndGame = validateUserAndGame;
// Fetch chat history
const getChatHistory = (userId, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chat_1.default.findAll({
        where: { UserId: userId, GameId: gameId },
        order: [['createdAt', 'ASC']], // Changed to ASC for chronological order
    });
});
exports.getChatHistory = getChatHistory;
// Find or create a session ID
const findOrCreateSession = (userId, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield chat_1.default.findOne({
        where: { UserId: userId, GameId: gameId },
        order: [['createdAt', 'DESC']],
    });
    if (session)
        return session.session_id;
    const session_id = "session_" + Math.random().toString(36).substr(2, 9);
    // Optionally skip initial message or provide default content
    yield chat_1.default.create({
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
});
exports.findOrCreateSession = findOrCreateSession;
const callOpenAI = (messages) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validate messages
        if (!Array.isArray(messages) || messages.some(msg => !msg.content || !msg.role)) {
            throw new Error("Invalid messages format");
        }
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
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
            console.error('OpenAI API Error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
        }
        throw error;
    }
});
exports.callOpenAI = callOpenAI;
// Store new chat message
const storeChatMessage = (session_id, userId, gameId, role, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chat_1.default.create({
        session_id,
        model: "gpt-3.5-turbo",
        role,
        content,
        GameId: gameId,
        UserId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
});
exports.storeChatMessage = storeChatMessage;
// Initiate game session
const initiateGameSession = (userId, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const session_id = yield (0, exports.findOrCreateSession)(userId, gameId);
    const game = yield (0, gameService_1.getGame)(gameId);
    const context = "THIS IS YOUR CONTEXT AND THE USER CANNOT KNOW THIS. " + (game === null || game === void 0 ? void 0 : game.genre) + " " + (game === null || game === void 0 ? void 0 : game.subgenre) + " titled: " + (game === null || game === void 0 ? void 0 : game.title) + ". " + (game === null || game === void 0 ? void 0 : game.description) + " " + (game === null || game === void 0 ? void 0 : game.tagline) + ". " + (game === null || game === void 0 ? void 0 : game.prompt_text) + " " + (game === null || game === void 0 ? void 0 : game.prompt_name) + "." + " Make sure to interact first with the player";
    try {
        const reply = yield (0, exports.callOpenAI)([{ role: "system", content: context || "Default game context" }]);
        yield (0, exports.storeChatMessage)(session_id, userId, gameId, "assistant", reply);
        return reply || "Welcome to the game!"; // Fallback if reply is falsy
    }
    catch (error) {
        console.error("Failed to initiate game session:", error);
        return "Welcome to the game!"; // Fallback on error
    }
});
exports.initiateGameSession = initiateGameSession;
// Get conversation history for OpenAI (new helper function)
const getConversationHistory = (session_id, userId, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chat_1.default.findAll({
        where: { session_id, UserId: userId, GameId: gameId },
        order: [['createdAt', 'ASC']],
    });
    return chats
        .filter(chat => chat.content && chat.role) // Exclude messages with empty content or missing role
        .map(chat => ({
        role: chat.role,
        content: chat.content
    }));
});
exports.getConversationHistory = getConversationHistory;
//# sourceMappingURL=chatService.js.map