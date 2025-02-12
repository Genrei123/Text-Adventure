import { Request, Response } from 'express';
import OpenAI from  "openai";
import axios from 'axios';
import Chat from '../model/chat';
import User from '../model/user';
import Game from '../model/game';



export const handleChatRequest = async (req: Request, res: Response) => {
    try {
        // Check for request if it's valid or not
        if (!req.body || !req.body.message) {
            res.status(400).send("Invalid request body.");
            return;
        }

        if (!process.env.OPENAI_API_KEY) {
            res.status(500).send("OpenAI API key not found.");
            return;
        }

        // Look for old chats
        const previousChats = await Chat.findAll({
            where: { session_id: req.body.session_id },
            order: [['createdAt', 'DESC']],
        });

        if (!previousChats) {
            // Check if UserId and GameId are provided and valid
            const user = await User.findByPk(req.body.userId);
            if (!user) {
                res.status(400).send("User not found.");
                return;
            }

            const game = await Game.findByPk(req.body.gameId);
            if (!game) {
                res.status(400).send("Game not found.");
                return;
            }

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