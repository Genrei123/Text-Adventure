import Chat from "../../model/chat/chat";
import User from "../../model/user/user";
import Game from "../../model/game/game";
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
        order: [['createdAt', 'DESC']],
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
    await Chat.create({
        session_id,
        UserId: userId,
        GameId: gameId,
        content: "", // Initial empty message
        role: "assistant",
        model: "gpt-3.5-turbo",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return session_id;
};

// Call OpenAI API
export const callOpenAI = async (messages: any[]) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages,
    }, {
        headers: {
            Authorization: `Bearer ` + process.env.MY_OPENAI_API_KEY,
            "Content-Type": "application/json"
        }
    });

    return response.data.choices[0].message.content;
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
