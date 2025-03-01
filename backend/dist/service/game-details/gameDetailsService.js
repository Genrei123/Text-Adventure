"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const getGameDetails = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield game_1.default.findOne({
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
});
exports.getGameDetails = getGameDetails;
const getGameComments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comments_1.default.findAll({
        where: { GameId: id },
        include: [{
                model: user_1.default,
                attributes: ['username', 'id']
            }],
        order: [['createdAt', 'DESC']]
    });
    return comments;
});
exports.getGameComments = getGameComments;
const getGameRatings = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ratings = yield rating_1.default.findAll({
        where: { GameId: id },
        include: [{
                model: user_1.default,
                attributes: ['username', 'id']
            }]
    });
    return ratings;
});
exports.getGameRatings = getGameRatings;
const addGameComments = (gameId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate if game exists
    const game = yield game_1.default.findByPk(gameId);
    if (!game) {
        throw new Error(`Game with id ${gameId} not found`);
    }
    // Create the comment
    const newComment = yield comments_1.default.create({
        content,
        GameId: gameId,
        UserId: userId
    });
    // Return the created comment with user information
    const comment = yield comments_1.default.findByPk(newComment.id, {
        include: [{
                model: user_1.default,
                attributes: ['username', 'id']
            }]
    });
    if (!comment) {
        throw new Error(`Created comment with id ${newComment.id} not found`);
    }
    return comment;
});
exports.addGameComments = addGameComments;
const addGameRatings = (gameId, userId, score) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate if game exists
    const game = yield game_1.default.findByPk(gameId);
    if (!game) {
        throw new Error(`Game with id ${gameId} not found`);
    }
    // Check if user has already rated this game
    const existingRating = yield rating_1.default.findOne({
        where: {
            GameId: gameId,
            UserId: userId
        }
    });
    if (existingRating) {
        // Update existing rating
        yield existingRating.update({ score });
        return existingRating;
    }
    // Create new rating
    return rating_1.default.create({
        score,
        GameId: gameId,
        UserId: userId
    });
});
exports.addGameRatings = addGameRatings;
//# sourceMappingURL=gameDetailsService.js.map