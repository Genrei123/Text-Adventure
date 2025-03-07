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
import User from "../../../model/user/user";
import { Op } from "sequelize";

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await getGames();
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};

export const getGameById = async (req: Request, res: Response) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await getGameDetails(gameId);
        if (!game) {
            res.status(404).send("Game not found");
        } else {
            res.status(200).json(game);
        }
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
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

export const getGameByUsername = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username } = req.params;

        // Find the user by username first
        const user = await User.findOne({ 
            where: { username },
            attributes: ['id'] 
        });

        // If no user found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all games created by this user
        const games = await Game.findAll({ 
            where: { UserId: user.id },
            // Optional: you can add more attributes or include related models if needed
            attributes: [
                'id', 
                'title', 
                'slug', 
                'description', 
                'genre', 
                'subgenre', 
                'image_data', 
                'createdAt'
            ],
            order: [['createdAt', 'DESC']] // Optional: sort by most recent first
        });

        // Return the games
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};

export const getGameByTitle = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title } = req.query;

        // Validate title input
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ message: "Title is required" });
        }

        // Find games with a title that contains the input (case-insensitive)
        const games = await Game.findAll({ 
            where: {
                title: {
                    [Op.iLike]: `%${title}%`  // Case-insensitive partial match
                }
            },
            attributes: [
                'id', 
                'title', 
                'slug', 
                'description', 
                'genre', 
                'subgenre', 
                'image_data', 
                'primary_color',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']],
            limit: 50  // Limit to prevent overly broad searches
        });

        // If no games found
        if (games.length === 0) {
            return res.status(404).json({ message: "No games found matching the title" });
        }

        // Return the games
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).send(errorMessage);
    }
};