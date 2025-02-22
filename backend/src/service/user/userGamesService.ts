import Game from '../../model/game/game';
import Comment from '../../model/game/comments';
import Rating from '../../model/game/rating';
import User from '../../model/user/user';

export const getGames = async (userId: number): Promise<Game[]> => {
    const games = await Game.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']]
    });

    return games;
};

export const getUserComments = async (userId: number): Promise<Comment[]> => {
    const comments = await Comment.findAll({
        where: { UserId: userId },
        include: [{
            model: Game,
            attributes: ['title', 'id']
        }],
        order: [['createdAt', 'DESC']]
    });

    return comments;
};

export const getUserRatings = async (userId: number): Promise<Rating[]> => {
    const ratings = await Rating.findAll({
        where: { UserId: userId },
        include: [{
            model: Game,
            attributes: ['title', 'id']
        }]
    });

    return ratings;
};
