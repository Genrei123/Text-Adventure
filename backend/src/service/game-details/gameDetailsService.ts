import Game from '../../model/game/game';
import Comment from '../../model/game/comments';
import Rating from '../../model/game/rating';
import User from '../../model/user/user';
import { sequelize } from '../../service/database';

export const getGameDetails = async (gameId: number) => {
    try {
      const game = await Game.findByPk(gameId);
      if (!game) return null;
  
      const ratings = await Rating.findAll({ where: { GameId: gameId } }); // Fixed: Use GameId
      const averageRating = ratings.length
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;
  
      return {
        ...game.toJSON(),
        rating: averageRating,  
        ratingCount: ratings.length
      };
    } catch (error) {
      console.error("Error in getGameDetails:", error);
      throw error;
    }
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