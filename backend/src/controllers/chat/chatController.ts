import { Request, Response } from 'express';
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

    try {
        // Check if the user exists
        const user = await User.findByPk(UserId);
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Check if the game exists
        const game = await Game.findByPk(GameId);
        if (!game) {
            res.status(400).json({ message: 'Game not found' });
            return;
        }

        // Sanitize user input
        const sanitizedContent = sanitizeInput(content);

        // Create a new chat entry
        const newChat = await Chat.create({
            session_id,
            model,
            role,
            content: sanitizedContent,
            GameId,
            UserId,
            parent_id,
            image_prompt_name,
            image_prompt_text,
            image_url,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({
            message: 'Response processed successfully',
            chat: newChat,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        } else {
            console.error('Error processing user response:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};