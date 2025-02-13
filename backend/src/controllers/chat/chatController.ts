import { Request, Response } from 'express';
import OpenAI from  "openai";
import axios from 'axios';
import { ValidationError } from 'sequelize';
import Chat from '../../model/chat/chat';
import User from '../../model/user/user';
import Game from '../../model/game/game';
import { sanitizeInput } from '../../utils/sanitizeInput';

export const processUserResponse = async (req: Request, res: Response): Promise<void> => {
    const { session_id, model, role, content, GameId, UserId, parent_id, image_prompt_name, image_prompt_text, image_url } = req.body;

    // Log the received request body for debugging
    console.log('Received payload:', req.body);

    // Validate required fields
    if (!session_id || !model || !role || !content || !GameId || !UserId) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    // Check for valid content type
    if (typeof content !== 'string' || content.trim() === '') {
        res.status(400).json({ message: 'Invalid content field' });
        return;
    }
};

export const handleChatRequest = async (req: Request, res: Response) => {
    try {
        // Check for request if it's valid or not
        if (!req.body || !req.body.message) {
            res.status(400).send("Invalid request body.");
            return;
        }

        // Check if the user exists
        const isUser = await User.findByPk(req.body.userId);
        if (!isUser) {
            res.status(400).send("User not found.");
            return;
        }

        const game = await Game.findByPk(req.body.gameId);
        if (!game) {
            res.status(400).send("Game not found.");
            return;
        }

        const session = await Chat.findOne({
            where: { UserId: req.body.userId, GameId: req.body.gameId },
            order: [['createdAt', 'DESC']],
        });

        // If no existing session, generate a new session ID
        let session_id = "";
        if (!session) {
            session_id = "session_" + Math.random().toString(36).substr(2, 9);

            // Store the new session in the database
            await Chat.create({
                session_id: session_id,
                UserId: req.body.userId,
                GameId: req.body.gameId,
                content: req.body.message, // Empty initial message
                role: "assistant",
                model: "gpt-3.5-turbo",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } else {
            req.body.session_id = session.session_id; // Use the existing session ID
        }

        // Look for old chats
        const previousChats = await Chat.findAll({
            where: { session_id: req.body.session_id },
            order: [['createdAt', 'DESC']],
        });

        if (!previousChats) {
            // Generate a unique session ID
            req.body.session_id = "text" + Math.random().toString(36).substr(2, 9);

            // Create a new chat if user and game are valid
            await Chat.create({
                session_id: req.body.session_id,
                model: "gpt-3.5-turbo",
                role: "user",
                content: req.body.message,
                GameId: req.body.gameId,
                UserId: req.body.userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }


        // Prepare messages for, we are basically copying the previous chats and adding the new message
        const messages = previousChats.map((chat) => ({
            role: chat.role,
            content: chat.content,
        })); 

        // Add the new message
        messages.push({
            role: "user",
            content: req.body.message,
        });

        // Call OpenAI API
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages,
            },

            {
                headers: {
                    Authorization: `Bearer ` +  process.env.MY_OPENAI_API_KEY,
                    "Content-Type": "application/json"
                }
            });

        const reply = response.data.choices[0].message.content;

        // Save the chat
        // The role is in the assistant side because we are saving the AI's response instead of our response
        // We are inputting the date that we have set it to be the current date
        await Chat.create({
            session_id: req.body.session_id,
            model: "gpt-3.5-turbo",
            role: "assistant",
            content: reply,
            GameId: req.body.gameId,
            UserId: req.body.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(200).send({
            message: reply,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
        return;
    }
};

