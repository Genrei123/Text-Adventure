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
exports.getUserRatings = exports.getUserComments = exports.getGames = void 0;
const game_1 = __importDefault(require("../../model/game/game"));
const comments_1 = __importDefault(require("../../model/game/comments"));
const rating_1 = __importDefault(require("../../model/game/rating"));
const getGames = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield game_1.default.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']]
    });
    return games;
});
exports.getGames = getGames;
const getUserComments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comments_1.default.findAll({
        where: { UserId: userId },
        include: [{
                model: game_1.default,
                attributes: ['title', 'id']
            }],
        order: [['createdAt', 'DESC']]
    });
    return comments;
});
exports.getUserComments = getUserComments;
const getUserRatings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const ratings = yield rating_1.default.findAll({
        where: { UserId: userId },
        include: [{
                model: game_1.default,
                attributes: ['title', 'id']
            }]
    });
    return ratings;
});
exports.getUserRatings = getUserRatings;
//# sourceMappingURL=userGamesService.js.map