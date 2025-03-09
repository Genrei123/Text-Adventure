"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGameRatings = exports.addGameComments = exports.getGameRatings = exports.getGameComments = exports.getGameDetails = void 0;
const game_1 = __importDefault(require("../../model/game/game"));
const comments_1 = __importDefault(require("../../model/game/comments"));
const rating_1 = __importDefault(require("../../model/game/rating"));
const user_1 = __importDefault(require("../../model/user/user"));
const database_1 = require("../../service/database");
const getGameDetails = async (gameId) => {
    return await game_1.default.findOne({
        where: { id: gameId },
        include: [{
                model: rating_1.default,
                attributes: [
                    [database_1.sequelize.fn('AVG', database_1.sequelize.col('score')), 'averageRating'],
                    [database_1.sequelize.fn('COUNT', database_1.sequelize.col('Ratings.id')), 'totalRatings']
                ],
                required: false // Use LEFT JOIN
            }],
        group: [
            'Game.id', // Group by the primary key of the Game table
            'Ratings.id' // Include Ratings.id in the GROUP BY clause if needed
        ]
    });
};
exports.getGameDetails = getGameDetails;
const getGameComments = async (id) => {
    const comments = await comments_1.default.findAll({
        where: { GameId: id },
        include: [{
                model: user_1.default,
                attributes: ['username', 'id']
            }],
        order: [['createdAt', 'DESC']]
    });
    return comments;
};
exports.getGameComments = getGameComments;
const getGameRatings = async (id) => {
    const ratings = await rating_1.default.findAll({
        where: { GameId: id },
        include: [{
                model: user_1.default,
                attributes: ['username', 'id']
            }]
    });
    return ratings;
};
exports.getGameRatings = getGameRatings;
const addGameComments = async (gameId, userId, content) => {
    // Validate if game exists
    const game = await game_1.default.findByPk(gameId);
    if (!game) {
        throw new Error(`Game with id ${gameId} not found`);
    }
    // Create the comment
    const newComment = await comments_1.default.create({
        content,
        GameId: gameId,
        UserId: userId
    });
    // Return the created comment with user information
    const comment = await comments_1.default.findByPk(newComment.id, {
        include: [{
                model: user_1.default,
                attributes: ['username', 'id']
            }]
    });
    if (!comment) {
        throw new Error(`Created comment with id ${newComment.id} not found`);
    }
    return comment;
};
exports.addGameComments = addGameComments;
const addGameRatings = async (gameId, userId, score) => {
    // Validate if game exists
    const game = await game_1.default.findByPk(gameId);
    if (!game) {
        throw new Error(`Game with id ${gameId} not found`);
    }
    // Check if user has already rated this game
    const existingRating = await rating_1.default.findOne({
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
    return rating_1.default.create({
        score,
        GameId: gameId,
        UserId: userId
    });
};
exports.addGameRatings = addGameRatings;
//# sourceMappingURL=gameDetailsService.js.map