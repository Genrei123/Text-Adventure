import Chat from "../../model/chat/chat";
import User from "../../model/user/user";
import Game from "../../model/game/game";
import { getGame } from "../game-creation/gameService";
import axios from "axios";

// Validate user and game
export const validateUserAndGame = async (userId: number, gameId: number) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found.");

    const game = await Game.findByPk(gameId);
    if (!game) throw new Error("Game not found.");
};

// Fetch chat history
export const getChatHistory = async (userId: number, gameId: number) => {
    return await Chat.findAll({
        where: { UserId: userId, GameId: gameId },
        order: [['createdAt', 'ASC']], // Changed to ASC for chronological order
    });
};

// Find or create a session ID
export const findOrCreateSession = async (userId: number, gameId: number) => {
    const session = await Chat.findOne({
        where: { UserId: userId, GameId: gameId },
        order: [['createdAt', 'DESC']],
    });

    if (session) return session.session_id;

    const session_id = "session_" + Math.random().toString(36).substr(2, 9);
    // Optionally skip initial message or provide default content
    await Chat.create({
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

// Call OpenAI API
interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export const callOpenAI = async (messages: ChatMessage[]) => {
    try {
        // Validate messages
        if (!Array.isArray(messages) || messages.some(msg => !msg.content || !msg.role)) {
            throw new Error("Invalid messages format");
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MY_OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('OpenAI API Error:', error.response?.data);
        }
        throw error;
    }
};

// Store new chat message
export const storeChatMessage = async (session_id: string, userId: number, gameId: number, role: string, content: string) => {
    return await Chat.create({
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

// Initiate game session
export const initiateGameSession = async (userId: number, gameId: number) => {
    const session_id = await findOrCreateSession(userId, gameId);
    const game = await getGame(gameId);

    const context = game?.genre + " " + game?.subgenre + " titled: " + game?.title + ". " + game?.description + " " + game?.tagline + ". " + game?.prompt_text + " " + game?.prompt_name + "." + " Make sure to interact first with the player";

    try {
        const reply = await callOpenAI([{ role: "system", content: context || "Default game context" }]);
        await storeChatMessage(session_id, userId, gameId, "assistant", reply);
        return reply || "Welcome to the game!"; // Fallback if reply is falsy
    } catch (error) {
        console.error("Failed to initiate game session:", error);
        return "Welcome to the game!"; // Fallback on error
    }
};

// Get conversation history for OpenAI (new helper function)
export const getConversationHistory = async (session_id: string, userId: number, gameId: number) => {
    const chats = await Chat.findAll({
        where: { session_id, UserId: userId, GameId: gameId },
        order: [['createdAt', 'ASC']],
    });

    return chats
        .filter(chat => chat.content && chat.role) // Exclude messages with empty content or missing role
        .map(chat => ({
            role: chat.role as "system" | "user" | "assistant",
            content: chat.content
        }));
};