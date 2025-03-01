"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRatings = exports.getUserComments = exports.getGames = void 0;
const game_1 = __importDefault(require("../../model/game/game"));
const comments_1 = __importDefault(require("../../model/game/comments"));
const rating_1 = __importDefault(require("../../model/game/rating"));
const getGames = async (userId) => {
    const games = await game_1.default.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']]
    });
    return games;
};
exports.getGames = getGames;
const getUserComments = async (userId) => {
    const comments = await comments_1.default.findAll({
        where: { UserId: userId },
        include: [{
                model: game_1.default,
                attributes: ['title', 'id']
            }],
        order: [['createdAt', 'DESC']]
    });
    return comments;
};
exports.getUserComments = getUserComments;
const getUserRatings = async (userId) => {
    const ratings = await rating_1.default.findAll({
        where: { UserId: userId },
        include: [{
                model: game_1.default,
                attributes: ['title', 'id']
            }]
    });
    return ratings;
};
exports.getUserRatings = getUserRatings;
//# sourceMappingURL=userGamesService.js.map