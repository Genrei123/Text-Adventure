import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import Chat from '../model/chat';
import { sanitizeInput } from '../utils/sanitizeInput';

export const processUserResponse = async (req: Request, res: Response): Promise<void> => {
    const { session_id, model, role, content, GameId, UserId, parent_id, image_prompt_name, image_prompt_text, image_url } = req.body;

    // Validate required fields
    if (!session_id || !content || !GameId || !UserId) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
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