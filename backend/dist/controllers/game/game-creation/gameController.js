"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRating = exports.addComment = exports.getRatings = exports.getComments = exports.createGame = exports.getGameById = exports.getAllGames = void 0;
const gameService_1 = require("../../../service/game-creation/gameService");
const gameDetailsService_1 = require("../../../service/game-details/gameDetailsService");
const getAllGames = async (req, res) => {
    try {
        const games = await (0, gameService_1.getGames)();
        res.status(200).json(games);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};
exports.getAllGames = getAllGames;
const getGameById = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await (0, gameDetailsService_1.getGameDetails)(gameId);
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
};
exports.getGameById = getGameById;
const createGame = async (req, res) => {
    try {
        const gameData = req.body;
        const game = await (0, gameService_1.addGame)(gameData, res);
        res.status(200).json({ message: "Game created successfully", game });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};
exports.createGame = createGame;
const getComments = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const comments = await (0, gameDetailsService_1.getGameComments)(gameId);
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};
exports.getComments = getComments;
const getRatings = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const ratings = await (0, gameDetailsService_1.getGameRatings)(gameId);
        res.status(200).json(ratings);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};
exports.getRatings = getRatings;
const addComment = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const { userId, content } = req.body;
        if (!content || content.trim().length === 0) {
            res.status(400).json({ message: "Comment content cannot be empty" });
            return;
        }
        const comment = await (0, gameDetailsService_1.addGameComments)(gameId, userId, content);
        res.status(201).json(comment);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};
exports.addComment = addComment;
const addRating = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const { userId, score } = req.body;
        if (!score || score < 1 || score > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }
        const rating = await (0, gameDetailsService_1.addGameRatings)(gameId, userId, score);
        res.status(201).json(rating);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};
exports.addRating = addRating;
//# sourceMappingURL=gameController.js.map