import { Request, Response } from "express";
import Game from "../../../model/game/game";
import { AddGame } from "../../../interfaces/game-creation/addGame";
import { 
    addGame, 
    getGame, 
    getGames 
} from "../../../service/game-creation/gameService";
import {
    getGameDetails,
    getGameComments,
    getGameRatings,
    addGameComments,
    addGameRatings
} from "../../../service/game-details/gameDetailsService";

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.findAll({
            attributes: ['id', 'title', 'genre', 'createdAt']
        });
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
};

export const getGameById = async (req: Request, res: Response) => {
    const gameId = parseInt(req.params.id, 10);

    if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID" });
    }

    try {
        const game = await getGameDetails(gameId);
        if (!game) {
            res.status(404).send("Game not found");
        } else {
            res.status(200).json(game);
        }
    } catch (error) {
        console.error('Error fetching game by ID:', error);
        res.status(500).json({ error: 'Error fetching game by ID' });
    }
};

export const createGame = async (req: Request, res: Response) => {
    try {
        const gameData: AddGame = req.body;
        const game = await addGame(gameData, res);
        res.status(200).json({ message: "Game created successfully", game });
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};

export const getComments = async (req: Request, res: Response) => {
    try {
        const gameId = parseInt(req.params.id);
        const comments = await getGameComments(gameId);
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};

export const getRatings = async (req: Request, res: Response) => {
    try {
        const gameId = parseInt(req.params.id);
        const ratings = await getGameRatings(gameId);
        res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const gameId = parseInt(req.params.id);
        const { userId, content } = req.body;

        if (!content || content.trim().length === 0) {
            res.status(400).json({ message: "Comment content cannot be empty" });
            return;
        }

        const comment = await addGameComments(gameId, userId, content);
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};

export const addRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const gameId = parseInt(req.params.id);
        const { userId, score } = req.body;

        if (!score || score < 1 || score > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }

        const rating = await addGameRatings(gameId, userId, score);
        res.status(201).json(rating);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};