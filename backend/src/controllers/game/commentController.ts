import { Request, Response } from 'express';
import Comment from '../../model/game/comments';
import User from '../../model/user/user';
import { createBan } from '../../service/banService';

/**
 * Controller to handle reporting a comment.
 * This creates a ban entry with type 'reported' that will be visible in the admin panel.
 * 
 * @param req - The request object containing the comment ID and user ID.
 * @param res - The response object.
 */
export const reportComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.id);
        const { userId, reason } = req.body;

        if (isNaN(commentId)) {
            res.status(400).json({ message: "Invalid comment ID" });
            return;
        }

        // Find the comment to get its content and user information
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        // Get the user information separately
        const user = await User.findByPk(comment.UserId);
        
        if (!user) {
            res.status(404).json({ message: "User associated with comment not found" });
            return;
        }

        // Create a ban entry with type 'reported'
        const ban = await createBan({
            userId: user.id,
            username: user.username,
            reason: reason || "Reported comment",
            banType: 'reported',
            comment: `Reported comment: "${comment.content?.substring(0, 100)}${comment.content && comment.content.length > 100 ? '...' : ''}"`,
        });

        res.status(201).json({ message: "Comment reported successfully", ban });
    } catch (error) {
        console.error('Error reporting comment:', error);
        res.status(500).json({ 
            message: "Failed to report comment", 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}; 
