import Game from '../../model/game/game';
import Comment from '../../model/game/comments';
import Rating from '../../model/game/rating';
import User from '../../model/user/user';
import { sequelize } from '../../service/database';

export const getGameDetails = async (gameId: number) => {
    return await Game.findOne({
        where: { id: gameId },
        include: [{
            model: Rating,
            attributes: [
                [sequelize.fn('AVG', sequelize.col('score')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'totalRatings']
            ],
            required: false // Use LEFT JOIN
        }],
        group: [
            'Game.id', // Group by the primary key of the Game table
            'Ratings.id' // Include Ratings.id in the GROUP BY clause if needed
        ]
    });
};

export const getGameComments = async (id: number): Promise<Comment[]> => {
    const comments = await Comment.findAll({
        where: { GameId: id },
        include: [{
            model: User,
            attributes: ['username', 'id']
        }],
        order: [['createdAt', 'DESC']]
    });

    return comments;
};

export const getGameRatings = async (id: number): Promise<Rating[]> => {
    const ratings = await Rating.findAll({
        where: { GameId: id },
        include: [{
            model: User,
            attributes: ['username', 'id']
        }]
    });

    return ratings;
};

export const addGameComments = async (gameId: number, userId: number, content: string): Promise<Comment> => {
    // Validate if game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
        throw new Error(`Game with id ${gameId} not found`);
    }

    // Create the comment
    const newComment = await Comment.create({
        content,
        GameId: gameId,
        UserId: userId
    });

    // Return the created comment with user information
    const comment = await Comment.findByPk(newComment.id, {
        include: [{
            model: User,
            attributes: ['username', 'id']
        }]
    });
    
    if (!comment) {
        throw new Error(`Created comment with id ${newComment.id} not found`);
    }
    
    return comment;
};

export const addGameRatings = async (gameId: number, userId: number, score: number): Promise<Rating> => {
    // Validate if game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
        throw new Error(`Game with id ${gameId} not found`);
    }

    // Check if user has already rated this game
    const existingRating = await Rating.findOne({
        where: {
            GameId: gameId,
            UserId: userId
        }
    });

    if (existingRating) {
        // Update existing rating
        await existingRating.update({ score });
        return existingRating;
    }

    // Create new rating
    return Rating.create({
        score,
        GameId: gameId,
        UserId: userId
    });
};