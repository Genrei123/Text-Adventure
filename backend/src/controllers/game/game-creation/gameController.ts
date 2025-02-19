import Game from "../../../model/game/game";
import { AddGame } from "../../../interfaces/game-creation/addGame";
import { addGame, getGame, getGames } from "../../../service/game-creation/gameService";
import { Request, Response } from "express";

/** 
 * The user must be able to upload their game with the Game.ts model
*/

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
        const game = await getGame(gameId);
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
