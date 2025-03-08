import { Request, Response, NextFunction } from "express";
import Game from "../../../model/game/game";
import { AddGame } from "../../../interfaces/game-creation/addGame";
import { addGame, getGame, getGames } from "../../../service/game-creation/gameService";
import {
  getGameDetails,
  getGameComments,
  getGameRatings,
  addGameComments,
  addGameRatings
} from "../../../service/game-details/gameDetailsService";
import User from "../../../model/user/user";
import { Op } from "sequelize";

// Named exports instead of default object
export const getAllGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await getGames();
    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const getGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameId = parseInt(req.params.id);
    if (isNaN(gameId)) {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }
    const game = await getGameDetails(gameId);
    if (!game) {
      res.status(404).send("Game not found");
      return;
    }
    res.status(200).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const createGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameData: AddGame = req.body;
    const game = await addGame(gameData, res);
    res.status(200).json({ message: "Game created successfully", game });
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameId = parseInt(req.params.id);
    if (isNaN(gameId)) {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }
    const comments = await getGameComments(gameId);
    res.status(200).json(comments || []);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const getRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gameId = parseInt(req.params.id);
    if (isNaN(gameId)) {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }
    const ratings = await getGameRatings(gameId);
    console.log(`getGameRatings(${gameId}) returned:`, ratings); // Debug
    res.status(200).json(ratings || []);
  } catch (error) {
    console.error("Error in getRatings:", error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameId = parseInt(req.params.id);
    const { userId, content } = req.body;

    if (isNaN(gameId)) {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }
    if (!content || content.trim().length === 0) {
      res.status(400).json({ message: "Comment content cannot be empty" });
      return;
    }

    const comment = await addGameComments(gameId, userId, content);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const addRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameId = parseInt(req.params.id);
    const { userId, score } = req.body;

    if (isNaN(gameId)) {
      res.status(400).json({ message: "Invalid game ID" });
      return;
    }
    if (!score || score < 1 || score > 5) {
      res.status(400).json({ message: "Rating must be between 1 and 5" });
      return;
    }

    const rating = await addGameRatings(gameId, userId, score);
    res.status(201).json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const getGameByUsername = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username }, attributes: ['id'] });
    if (!user) return res.status(404).json({ message: "User not found" });

    const games = await Game.findAll({
      where: { UserId: user.id },
      attributes: ['id', 'title', 'slug', 'description', 'genre', 'subgenre', 'image_data', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const getGameByTitle = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title } = req.query;
    if (!title || typeof title !== 'string') return res.status(400).json({ message: "Title is required" });

    const games = await Game.findAll({
      where: { title: { [Op.iLike]: `%${title}%` } },
      attributes: ['id', 'title', 'slug', 'description', 'genre', 'subgenre', 'image_data', 'primary_color', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    if (games.length === 0) return res.status(404).json({ message: "No games found matching the title" });
    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};