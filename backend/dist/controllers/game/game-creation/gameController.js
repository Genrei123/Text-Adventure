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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRating = exports.addComment = exports.getRatings = exports.getComments = exports.createGame = exports.getGameById = exports.getAllGames = void 0;
const gameService_1 = require("../../../service/game-creation/gameService");
const gameDetailsService_1 = require("../../../service/game-details/gameDetailsService");
const getAllGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const games = yield (0, gameService_1.getGames)();
        res.status(200).json(games);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.getAllGames = getAllGames;
const getGameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = parseInt(req.params.id);
        const game = yield (0, gameDetailsService_1.getGameDetails)(gameId);
        if (!game) {
            res.status(404).send("Game not found");
        }
        else {
            res.status(200).json(game);
        }
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.getGameById = getGameById;
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameData = req.body;
        const game = yield (0, gameService_1.addGame)(gameData, res);
        res.status(200).json({ message: "Game created successfully", game });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.createGame = createGame;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = parseInt(req.params.id);
        const comments = yield (0, gameDetailsService_1.getGameComments)(gameId);
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.getComments = getComments;
const getRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = parseInt(req.params.id);
        const ratings = yield (0, gameDetailsService_1.getGameRatings)(gameId);
        res.status(200).json(ratings);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.getRatings = getRatings;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = parseInt(req.params.id);
        const { userId, content } = req.body;
        if (!content || content.trim().length === 0) {
            res.status(400).json({ message: "Comment content cannot be empty" });
            return;
        }
        const comment = yield (0, gameDetailsService_1.addGameComments)(gameId, userId, content);
        res.status(201).json(comment);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.addComment = addComment;
const addRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = parseInt(req.params.id);
        const { userId, score } = req.body;
        if (!score || score < 1 || score > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }
        const rating = yield (0, gameDetailsService_1.addGameRatings)(gameId, userId, score);
        res.status(201).json(rating);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
});
exports.addRating = addRating;
//# sourceMappingURL=gameController.js.map